#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3210";
let failures = 0;
const ok = (name, cond, extra="") => {
  const pass = Boolean(cond);
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e.stack || e).slice(0,300)));

await page.goto(BASE + "/__dse/editor", { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(1800);

ok("studio opens on actual page", page.url().startsWith(BASE + "/"));
ok("studio toolbar visible", await page.locator("#socios-studio-toolbar").isVisible());
ok("original is default", await page.locator("#studioDraftSelect").inputValue() === "__original");
ok("legacy iframe is not used", (await page.locator("iframe").count()) === 0);

await page.click("#studioDuplicate");
await page.waitForTimeout(400);
const draft = await page.locator("#studioDraftSelect").inputValue();
ok("duplicate creates editable draft", draft !== "__original" && !!draft);

const target = page.locator("body h1:visible, body h2:visible, body p:visible, body button:visible").first();
if (await target.count()) {
  await target.click({ force: true });
  await page.waitForTimeout(300);
  ok("clicking live element opens inspector", await page.locator("#socios-studio-inspector").isVisible());
  ok("inspector has generic CSS fallback", (await page.locator("#socios-studio-inspector").textContent()).includes("Any CSS property"));
}

await page.selectOption("#studioDraftSelect", "__original");
await page.waitForTimeout(250);
ok("original becomes read-only", await page.locator("#socios-studio-inspector").isHidden());

await page.selectOption("#studioDraftSelect", draft);
await page.waitForTimeout(250);
ok("draft can be reselected", await page.locator("#studioDraftSelect").inputValue() === draft);

ok("no uncaught studio errors", errors.length === 0, errors[0] || "");
await browser.close();

if (failures) {
  console.error(`\n${failures} Socios Studio check(s) failed.`);
  process.exit(1);
}
console.log("\nSocios Studio checks passed.");


/* Studio editability regressions */
await page.goto(BASE + "/__dse/editor", { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(1200);
if ((await page.locator("#studioDraftSelect").inputValue()) === "__original") {
  await page.click("#studioDuplicate");
  await page.waitForTimeout(250);
}
const chartHit = await page.evaluate(() => {
  const markets = document.querySelector('[data-widget-id="markets"]');
  const svgs = [...(markets?.querySelectorAll("svg") || [])];
  const candidate = svgs.find((svg) => {
    const r = svg.getBoundingClientRect();
    return r.width >= 55 && r.height >= 14 && r.height <= 90 && r.width / Math.max(r.height,1) >= 1.7;
  });
  if (!candidate) return false;
  const child = candidate.querySelector("path,line,rect,circle,polyline,polygon") || candidate;
  child.dispatchEvent(new MouseEvent("click", { bubbles:true, cancelable:true, view:window }));
  return true;
});
if (chartHit) {
  await page.waitForTimeout(200);
  ok("small market sparkline is treated as chart", (await page.locator("#socios-studio-inspector .studio-kicker").textContent()) === "CHART");
}

const buttonSelected = await page.evaluate(() => {
  const b = [...document.querySelectorAll("button,a")].find((e) => /Buy your first fan token/i.test((e.textContent||"").trim()));
  if (!b) return false;
  b.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
  return true;
});
if (buttonSelected) {
  await page.waitForTimeout(200);
  ok("CTA exposes button fill control", (await page.locator("#socios-studio-inspector").textContent()).includes("Button fill"));
}

const bgSelected = await page.evaluate(() => {
  const el = [...document.querySelectorAll("section,div")].find((e) => {
    const bg = getComputedStyle(e).backgroundImage;
    const r=e.getBoundingClientRect();
    return bg && bg !== "none" && r.width > 300 && r.height > 150;
  });
  if (!el) return false;
  el.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
  return true;
});
if (bgSelected) {
  await page.waitForTimeout(200);
  ok("CSS background image can be replaced", (await page.locator("#socios-studio-inspector").textContent()).includes("Background image"));
}

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

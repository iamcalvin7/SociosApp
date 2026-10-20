#!/usr/bin/env node
/**
 * Drives a real (headless) Chrome against the local mirror and verifies that
 * client-side navigation works: clicks key links, captures console errors,
 * failed requests, and final URLs.
 *
 * Usage: node tools/browser-check.mjs [base-url] (default http://localhost:3210)
 */

import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3210";
const TARGETS = ["/market/CITY", "/fan-token-play"];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleMsgs = [];
const failedReqs = [];
page.on("console", (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`.slice(0, 400)));
page.on("pageerror", (err) => consoleMsgs.push(`[pageerror] ${String(err)}`.slice(0, 600)));
page.on("requestfailed", (req) => {
  failedReqs.push(`${req.failure()?.errorText} ${req.method()} ${req.url()}`.slice(0, 300));
});
page.on("response", (res) => {
  if (res.status() >= 400) failedReqs.push(`HTTP ${res.status()} ${res.request().method()} ${res.url()}`.slice(0, 300));
});

async function dump(tag) {
  console.log(`\n===== ${tag} =====`);
  console.log("url:", page.url());
  const title = await page.title().catch(() => "<failed>");
  console.log("title:", title);
  const h1 = await page.locator("h1, [class*=title], main").first().textContent({ timeout: 3000 }).catch(() => "<none>");
  console.log("first heading:", (h1 || "").trim().slice(0, 120));
}

await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(2500); // hydration
await dump("after load /");

for (const target of TARGETS) {
  consoleMsgs.length = 0;
  failedReqs.length = 0;
  const link = page.locator(`a[href="${target}"]`).first();
  if ((await link.count()) === 0) {
    console.log(`\n!! no link found for ${target} (maybe already on page)`);
    if (page.url().endsWith(target)) continue;
    continue;
  }
  await link.click({ timeout: 5000 });
  await page.waitForTimeout(2500);
  await dump(`after click -> ${target}`);
  if (consoleMsgs.length) {
    console.log("--- console (last 10) ---");
    for (const m of consoleMsgs.slice(-10)) console.log("  ", m);
  }
  if (failedReqs.length) {
    console.log("--- failed/4xx+ requests (last 10) ---");
    for (const m of failedReqs.slice(-10)) console.log("  ", m);
  }
  const ok = page.url().includes(target.slice(1));
  console.log(ok ? "NAVIGATION OK" : "NAVIGATION FAILED");
}

await page.screenshot({ path: "/tmp/final-state.png" });
await browser.close();

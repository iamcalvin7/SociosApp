#!/usr/bin/env node
/**
 * End-to-end checks for the simplified Socios visual editor.
 *
 * Usage: node tools/editor-check.mjs [base-url] (default http://localhost:3210)
 */

import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3210";
let failures = 0;

function ok(name, cond, extra = "") {
  const pass = Boolean(cond);
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
}

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mP8z8Dwn4GBgYGJAQoAHgQCAZ7Pj6sAAAAASUVORK5CYII=",
  "base64"
);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
const errors = [];
page.on("pageerror", (err) => {
  const stack = String(err.stack || err);
  if (/_next\/static|Minified React error/.test(stack)) return;
  errors.push(stack.slice(0, 300));
});

const getFrame = () => page.frames().find((f) => f !== page.mainFrame());

function simpleRow(label, root = "#siBody") {
  return page
    .locator(`${root} .si-row`)
    .filter({ has: page.locator(".si-label strong", { hasText: new RegExp(`^${label}$`) }) })
    .first();
}

async function setColor(label, hex, root = "#siBody") {
  const input = simpleRow(label, root).locator(".si-color-val");
  await input.fill(hex);
  await input.press("Enter");
  await page.waitForTimeout(500);
}

async function pick(fn) {
  await page.click("#btnSelectMain");
  await getFrame().evaluate(fn);
  await page.waitForTimeout(500);
}

await page.goto(BASE + "/__dse/legacy", { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  for (const k of ["dse.tokens.v1", "dse.themes.v1", "dse.active.concept.v1", "dse.assets.library.v1", "dse.preview.state.v1"])
    localStorage.removeItem(k);
});
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(3200);

ok("editor page loads", (await page.title()).includes("Visual Editor"));
ok("new concept is selected", (await page.locator("#conceptSelect").inputValue()) === "Concept A");
ok("select action is primary", await page.locator("#btnSelectMain").isVisible());
ok("brand action is available", await page.locator("#btnBrandMain").isVisible());
ok("undo and redo are visible", (await page.locator("#btnUndo").isVisible()) && (await page.locator("#btnRedo").isVisible()));
ok("original and edited are visible", (await page.locator("#compareSwitch button").count()) === 2);
ok("export is visible", await page.locator("#btnExport").isVisible());
ok("advanced is available", await page.locator("#btnAdvanced").isVisible());
ok("token lists are hidden by default", await page.locator("#tokenList").isHidden());
ok("live preview loaded", await page.locator("#preview").evaluate((f) => !!f.contentDocument?.body));
ok("overlay is active in preview", await getFrame().evaluate(() => !!window.__dse && !!document.getElementById("dse-tokens")));

// ---- Button ----
await pick(() => {
  const el = [...document.querySelectorAll("button")].find(
    (e) => /^Claim$/.test((e.textContent || "").trim()) && e.getClientRects().length
  );
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("clicking a button opens the inspector", await page.locator("#simpleInspector").isVisible());
ok("button is identified", (await page.locator("#siKind").textContent()) === "BUTTON");
ok("button name is human", (await page.locator("#siName").textContent()) === "Claim");
ok("button controls rendered", (await page.locator("#siBody .si-row").count()) >= 4);
const buttonText = await page.locator("#siBody").textContent();
ok("inspector avoids technical labels", !/token|selector|scope|css|var\(/i.test(buttonText || ""), buttonText.slice(0, 80));

await setColor("Background", "#000000");
const claimBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
const otherBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Top up$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("button background changes live", /rgb\(0,\s*0,\s*0\)/.test(claimBg || ""), String(claimBg));
ok("only the clicked button changes", !/rgb\(0,\s*0,\s*0\)/.test(otherBg || ""), String(otherBg));
ok("apply-to-similar is offered", await page.locator("#siSimilarWrap").isVisible());

await page.click("#siSimilar");
await page.waitForTimeout(500);
const otherBg2 = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Top up$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("apply to similar updates matching buttons", /rgb\(0,\s*0,\s*0\)/.test(otherBg2 || ""), String(otherBg2));

await page.click("#btnUndo");
await page.waitForTimeout(500);
const otherBg3 = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Top up$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("undo reverses the last change", !/rgb\(0,\s*0,\s*0\)/.test(otherBg3 || ""), String(otherBg3));
await page.click("#btnRedo");
await page.waitForTimeout(500);
const otherBg4 = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Top up$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("redo restores the change", /rgb\(0,\s*0,\s*0\)/.test(otherBg4 || ""), String(otherBg4));
await page.click("#btnUndo");
await page.waitForTimeout(400);

// ---- Text ----
const beforeTextSize = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("span")].find((e) => e.textContent.trim() === "Liquid staking");
  return el ? getComputedStyle(el).fontSize : null;
});
await pick(() => {
  const el = [...document.querySelectorAll("span")].find(
    (e) => e.textContent.trim() === "Liquid staking" && e.getClientRects().length
  );
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("text is identified", (await page.locator("#siKind").textContent()) === "TEXT");
const textInput = simpleRow("Text").locator(".si-text");
await textInput.fill("Staking made simple");
await textInput.press("Enter");
await page.waitForTimeout(500);
ok("text wording updates live", await getFrame().evaluate(() => document.body.innerText.includes("Staking made simple")));
const sizeRange = simpleRow("Size").locator(".si-range");
await sizeRange.evaluate((el) => {
  el.value = "90";
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.waitForTimeout(500);
const afterTextSize = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("span")].find((e) => e.textContent.trim() === "Staking made simple");
  return el ? getComputedStyle(el).fontSize : null;
});
ok("text size updates live", afterTextSize && afterTextSize !== beforeTextSize, `${beforeTextSize} -> ${afterTextSize}`);

// ---- Card ----
await pick(() => {
  const el = [...document.querySelectorAll(".bg-card")].find((e) => e.getClientRects().length);
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("card is identified", (await page.locator("#siKind").textContent()) === "CARD");
await setColor("Background", "#f5f5f5");
const cardBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll(".bg-card")].find((e) => e.getClientRects().length);
  return el && getComputedStyle(el).backgroundColor;
});
ok("card background updates live", /rgb\(245,\s*245,\s*245\)/.test(cardBg || ""), String(cardBg));
ok("card controls include shadow and spacing", (await page.locator("#siBody .si-seg").count()) >= 2);

// ---- Image ----
const imgBefore = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("img")].find((e) => e.getClientRects().length);
  window.__dseTestImg = el;
  return el.getAttribute("src");
});
await pick(() => {
  window.__dseTestImg.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("image is identified", (await page.locator("#siKind").textContent()) === "IMAGE");
await page.getByText("Replace image", { exact: true }).click();
await page.setInputFiles("#assetFile", { name: "test.png", mimeType: "image/png", buffer: PNG });
await page.waitForTimeout(700);
const imgAfter = await getFrame().evaluate(() => window.__dseTestImg.getAttribute("src"));
const dataImages = await getFrame().evaluate(() => [...document.querySelectorAll("img")].filter((i) => (i.getAttribute("src") || "").startsWith("data:image")).length);
ok("image replacement updates live", (imgAfter || "").startsWith("data:image"), (imgAfter || "").slice(0, 32));
ok("image replacement targets one image", dataImages === 1, String(dataImages));
await page.click("#siReset");
await page.waitForTimeout(500);
const imgReset = await getFrame().evaluate(() => window.__dseTestImg.getAttribute("src"));
ok("image reset restores the original", imgReset === imgBefore, String(imgReset).slice(0, 32));

// ---- Icon ----
await pick(() => {
  const el = [...document.querySelectorAll("svg.lucide")].find((e) => e.getClientRects().length);
  window.__dseTestIcon = el;
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("icon is identified", (await page.locator("#siKind").textContent()) === "ICON");
await setColor("Colour", "#ff0000");
const iconColor = await getFrame().evaluate(() => getComputedStyle(window.__dseTestIcon).color);
ok("icon colour updates live", /rgb\(255,\s*0,\s*0\)/.test(iconColor || ""), String(iconColor));
await page.click("#siReset");
await page.waitForTimeout(400);

// ---- Section ----
await pick(() => {
  const el = document.querySelector("main.page-container");
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("section is identified as background", (await page.locator("#siKind").textContent()) === "BACKGROUND");

// ---- Compare ----
await pick(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()) && e.getClientRects().length);
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
const editedBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return getComputedStyle(el).backgroundColor;
});
await page.click('#compareSwitch button[data-compare="original"]');
await page.waitForTimeout(400);
const originalBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return getComputedStyle(el).backgroundColor;
});
ok("original disables the edits", originalBg !== editedBg && !/rgb\(0,\s*0,\s*0\)/.test(originalBg || ""), `${editedBg} -> ${originalBg}`);
await page.click('#compareSwitch button[data-compare="concept"]');
await page.waitForTimeout(400);
const backBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return getComputedStyle(el).backgroundColor;
});
ok("edited restores the edits", backBg === editedBg, String(backBg));

// ---- Export ----
await page.click("#btnExport");
await page.waitForTimeout(300);
const report = await page.locator("#exportReport").textContent();
ok("export panel opens", await page.locator("#exportPanel").isVisible());
ok("export summary is human readable", /Claim/.test(report) && /Background: #000000/.test(report), (report || "").slice(0, 80));
ok("developer details are available", await page.locator("#developerDetails").isVisible());
await page.click("#exportClose");

// ---- Brand ----
await page.click("#btnBrandMain");
await page.waitForTimeout(300);
ok("brand panel opens", await page.locator("#brandPanel").isVisible());
ok("brand panel is small", (await page.locator("#brandBody .si-row").count()) === 7);
await setColor("Primary colour", "#ff00aa", "#brandBody");
const brandState = await page.evaluate(() => {
  const store = JSON.parse(localStorage.getItem("dse.tokens.v1") || "{}");
  return { theme: store.light?.["--bg-brand"], button: store.global?.["--button-primary"] };
});
ok("brand primary updates theme token", brandState.theme === "#ff00aa", JSON.stringify(brandState));
ok("brand primary updates button token", brandState.button === "#ff00aa", JSON.stringify(brandState));
await page.click("#brandClose");

// ---- Auto-save ----
await page.waitForTimeout(700);
const saved = await page.evaluate(() => {
  const themes = JSON.parse(localStorage.getItem("dse.themes.v1") || "{}");
  const active = themes["Concept A"];
  return {
    indicator: document.querySelector("#savedState").textContent,
    scoped: active ? Object.keys(active.data.scoped || {}).length : 0,
  };
});
ok("changes are saved automatically", saved.indicator === "Saved" && saved.scoped > 0, JSON.stringify(saved));

// ---- Persistence ----
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(3000);
const persisted = await page.evaluate(() => document.querySelector("#conceptSelect").value);
ok("active concept persists", persisted === "Concept A", String(persisted));
const persistedBg = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("edits survive reload", /rgb\(0,\s*0,\s*0\)/.test(persistedBg || ""), String(persistedBg));

// ---- Concepts ----
page.once("dialog", (d) => d.accept("Concept B"));
await page.click("#conceptMenuBtn");
await page.click('#conceptMenu [data-concept="new"]');
await page.waitForTimeout(500);
ok("new concept is created", (await page.locator("#conceptSelect").inputValue()) === "Concept B");
ok("new concept is stored", await page.evaluate(() => !!JSON.parse(localStorage.getItem("dse.themes.v1") || "{}")["Concept B"]));

page.once("dialog", (d) => d.accept("Concept B copy"));
await page.click("#conceptMenuBtn");
await page.click('#conceptMenu [data-concept="duplicate"]');
await page.waitForTimeout(500);
ok("concept is duplicated", (await page.locator("#conceptSelect").inputValue()) === "Concept B copy");

page.once("dialog", (d) => d.accept("Concept C"));
await page.click("#conceptMenuBtn");
await page.click('#conceptMenu [data-concept="rename"]');
await page.waitForTimeout(500);
ok("concept is renamed", (await page.locator("#conceptSelect").inputValue()) === "Concept C");

page.once("dialog", (d) => d.accept());
await page.click("#conceptMenuBtn");
await page.click('#conceptMenu [data-concept="delete"]');
await page.waitForTimeout(500);
ok("concept is deleted", (await page.locator('#conceptSelect option[value="Concept C"]').count()) === 0);

// ---- Advanced ----
await page.click("#btnAdvanced");
await page.waitForTimeout(500);
ok("advanced opens", await page.locator("#advancedDrawer").isVisible());
ok("advanced exposes raw groups", (await page.locator("#groupNav button").count()) >= 8);
ok("advanced exposes raw tokens", (await page.locator("#tokenList .token-row").count()) > 20);
await page.click("#btnCloseAdvanced");
await page.waitForTimeout(400);
ok("advanced closes back to simple editor", await page.locator("#advancedDrawer").isHidden());

// ---- Portable themes ----
ok("upload theme action is visible", await page.locator("#btnUploadTheme").isVisible());
const builtin = await page.evaluate(() => window.SociosThemeSystem.builtin("socios-2026-light"));
const mapped = await page.evaluate(() => {
  const sys = window.SociosThemeSystem;
  const parsed = sys.parse(sys.builtin("socios-2026-light"));
  const store = sys.mapTheme(parsed.theme);
  return {
    summary: parsed.summary,
    brand: store.light["--bg-brand"],
    button: store.global["--button-primary"],
    cardRadius: store.global["--radius-lg"],
    scoped: Object.keys(store.scoped).length,
  };
});
ok("theme mapper validates all sections", mapped.summary.length === 6 && mapped.summary.every((s) => s.present));
ok("theme mapper writes brand tokens", mapped.brand === "#3137ff" && mapped.button === "#3137ff");
ok("theme mapper writes shape and scoped rules", mapped.cardRadius === "16px" && mapped.scoped > 20, JSON.stringify(mapped));

await page.click("#conceptMenuBtn");
ok("built-in theme is offered", await page.locator('#conceptMenu [data-concept="builtin"]').isVisible());
await page.click('#conceptMenu [data-concept="builtin"]');
await page.waitForTimeout(400);
ok("built-in theme panel opens", await page.locator("#themePanel").isVisible());
ok("theme name is detected", (await page.locator(".theme-detected-name").textContent()) === "Socios 2026 Light");
ok("theme summary shows categories", (await page.locator(".theme-check").count()) === 6);
ok("theme summary ticks present sections", (await page.locator(".theme-check .tick").count()) === 6);

const beforePreviewStore = await page.evaluate(() => localStorage.getItem("dse.tokens.v1"));
const beforePreviewBg = await getFrame().evaluate(() => getComputedStyle(document.body).backgroundColor);
await page.click("#btnThemePreview");
await page.waitForTimeout(600);
const previewBg = await getFrame().evaluate(() => getComputedStyle(document.body).backgroundColor);
const previewSaved = await page.evaluate(() => localStorage.getItem("dse.tokens.v1"));
ok("theme preview applies live", previewBg === "rgb(243, 246, 255)", String(previewBg));
ok("theme preview does not save", previewSaved === beforePreviewStore, String(previewSaved));
await page.click("#btnThemeCancel");
await page.waitForTimeout(500);
const cancelledBg = await getFrame().evaluate(() => getComputedStyle(document.body).backgroundColor);
ok("theme cancel closes the panel", await page.locator("#themePanel").isHidden());
ok("theme cancel restores the previous concept", cancelledBg === beforePreviewBg, `${previewBg} -> ${cancelledBg}`);

await page.click("#conceptMenuBtn");
await page.click('#conceptMenu [data-concept="builtin"]');
await page.waitForTimeout(300);
await page.click("#btnThemeAdd");
await page.waitForTimeout(900);
ok("adding built-in theme creates a concept", (await page.locator("#conceptSelect").inputValue()) === "Socios 2026 Light");
const builtinState = await page.evaluate(() => {
  const store = JSON.parse(localStorage.getItem("dse.tokens.v1") || "{}");
  const concept = JSON.parse(localStorage.getItem("dse.themes.v1") || "{}")["Socios 2026 Light"];
  return {
    brand: store.light && store.light["--bg-brand"],
    scoped: Object.keys(store.scoped || {}).length,
    saved: !!concept,
    portable: concept && concept.portable && concept.portable.meta.name,
  };
});
ok("built-in theme stores mapped tokens", builtinState.brand === "#3137ff" && builtinState.scoped > 20, JSON.stringify(builtinState));
ok("built-in theme is saved as an editable concept", builtinState.saved && builtinState.portable === "Socios 2026 Light");
const builtinPrimary = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll('button[data-slot="button"]')].find(
    (e) => String(e.className).includes("text-primary-foreground") && e.getClientRects().length
  );
  return el && { bg: getComputedStyle(el).backgroundColor, radius: getComputedStyle(el).borderRadius };
});
ok("theme primary button is applied", builtinPrimary && builtinPrimary.bg === "rgb(49, 55, 255)", JSON.stringify(builtinPrimary));

const uploadTheme = JSON.parse(JSON.stringify(builtin));
uploadTheme.meta.name = "Socios 2026 Light Upload";
await page.setInputFiles("#themeFile", {
  name: "socios-2026-light.json",
  mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify(uploadTheme)),
});
await page.waitForTimeout(500);
ok("uploaded theme is detected", (await page.locator(".theme-detected-name").textContent()) === "Socios 2026 Light Upload");
await page.click("#btnThemePreview");
await page.waitForTimeout(500);
await page.click("#btnThemeAdd");
await page.waitForTimeout(900);
ok("uploaded theme becomes a concept", (await page.locator("#conceptSelect").inputValue()) === "Socios 2026 Light Upload");
ok("uploaded theme is stored", await page.evaluate(() => !!JSON.parse(localStorage.getItem("dse.themes.v1") || "{}")["Socios 2026 Light Upload"]));

await pick(() => {
  const el = [...document.querySelectorAll("button")].find(
    (e) => /^Claim$/.test((e.textContent || "").trim()) && e.getClientRects().length
  );
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
});
ok("imported theme remains click-editable", (await page.locator("#siKind").textContent()) === "BUTTON");
await setColor("Background", "#000000");
const importedEdit = await getFrame().evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((e) => /^Claim$/.test(e.textContent.trim()));
  return el && getComputedStyle(el).backgroundColor;
});
ok("imported theme accepts direct edits", /rgb\(0,\s*0,\s*0\)/.test(importedEdit || ""), String(importedEdit));
await page.waitForTimeout(700);
ok("imported theme auto-saves edits", await page.evaluate(() => {
  const concept = JSON.parse(localStorage.getItem("dse.themes.v1") || "{}")["Socios 2026 Light Upload"];
  return !!concept && concept.portable && concept.portable.meta.name === "Socios 2026 Light Upload";
}));

await page.setInputFiles("#themeFile", {
  name: "broken.json",
  mimeType: "application/json",
  buffer: Buffer.from("{}"),
});
await page.waitForTimeout(500);
ok("invalid theme is rejected", await page.locator(".theme-error").isVisible());
ok("invalid theme disables adding", await page.locator("#btnThemeAdd").isDisabled());
await page.click("#btnThemeCancel");
await page.waitForTimeout(300);
ok("invalid theme can be cancelled", await page.locator("#themePanel").isHidden());

ok("no page errors", errors.length === 0, errors.join(" | ").slice(0, 240));

await browser.close();
console.log(failures ? `\n${failures} FAILED` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);

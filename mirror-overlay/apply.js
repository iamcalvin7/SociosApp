(() => {
  if (window.__dse) return;
  const KEY = "dse.tokens.v1";
  const SHADOW_DEFAULTS = {
    sm: { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", alpha: 0.1 },
    md: { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1 },
    lg: { x: 0, y: 10, blur: 15, spread: -3, color: "#000000", alpha: 0.1 },
    xl: { x: 0, y: 20, blur: 25, spread: -5, color: "#000000", alpha: 0.1 },
  };

  let store = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) store = JSON.parse(raw);
    } catch {}
    if (store && !store.fontRules) store.fontRules = {};
    if (store && !store.scoped) store.scoped = {};
    if (store && !store.assets) store.assets = {};
    if (store && !store.pages) store.pages = {};
    return store;
  }

  function persist() {
    try {
      if (isEmpty()) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(store));
    } catch {}
  }

  function isEmpty() {
    return (
      !store ||
      ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"].every(
        (g) => !store[g] || Object.keys(store[g]).length === 0
      ) &&
      (!store.pages ||
        Object.values(store.pages).every((p) =>
          !p || Object.values(p).every((g) => !g || Object.keys(g).length === 0)
        ))
    );
  }

  function defaults() {
    return store || (store = { v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, fontRules: {}, scoped: {}, assets: {}, pages: {} });
  }

  function pageOverridesFor(path) {
    const pages = (store && store.pages) || {};
    const clean = path.replace(/\/+$/, "") || "/";
    const entries = Object.entries(pages).filter(([route]) =>
      route === "/" ? clean === "/" : clean === route || clean.startsWith(route + "/")
    );
    entries.sort((a, b) => b[0].length - a[0].length);
    return entries.length ? entries[0][1] : null;
  }

  function effectiveGroup(name) {
    const base = (store && store[name]) || {};
    const page = pageOverridesFor(location.pathname);
    if (!page || !page[name]) return base;
    return { ...base, ...page[name] };
  }

  function shadowCss(name, s) {
    const d = SHADOW_DEFAULTS[name] || SHADOW_DEFAULTS.md;
    const x = s.x ?? d.x, y = s.y ?? d.y, blur = s.blur ?? d.blur, spread = s.spread ?? d.spread;
    const alpha = s.alpha ?? d.alpha, color = s.color || d.color;
    const hex = String(color).replace("#", "");
    const rgb =
      hex.length === 3
        ? hex.split("").map((c) => parseInt(c + c, 16))
        : [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) || 0);
    const rgba = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
    return `box-shadow:${x}px ${y}px ${blur}px ${spread}px ${rgba} !important`;
  }

  function buildCss() {
    let css = "";
    const entries = Object.entries(effectiveGroup("global")).concat(Object.entries(effectiveGroup("palette")));
    if (entries.length) {
      css += ":root{";
      for (const [k, v] of entries) css += `${k}:${v};`;
      css += "}";
    }
    for (const theme of ["dark", "light"]) {
      const list = Object.entries(effectiveGroup(theme));
      if (!list.length) continue;
      css += `[data-theme=${theme}]{`;
      for (const [k, v] of list) css += `${k}:${v};`;
      css += "}";
    }
    css += "[data-dse-swapped]{display:none!important}";
    return css;
  }

  function buildShadowCss() {
    const sh = effectiveGroup("shadows");
    const rules = [];
    for (const name of ["sm", "md", "lg", "xl"]) {
      if (sh[name]) rules.push(`.shadow-${name}{${shadowCss(name, sh[name])}}`);
    }
    return rules.join("");
  }

  function buildFontRulesCss() {
    const rules = effectiveGroup("fontRules");
    return Object.entries(rules)
      .map(([selector, family]) => {
        const sel = String(selector).replace(/[{}]/g, "").trim();
        const fam = String(family || "").replace(/["\\]/g, "");
        return sel && fam ? `${sel}{font-family:"${fam}", var(--font-sans) !important;}` : "";
      })
      .join("");
  }

  function buildScopedCss() {
    const entries = effectiveGroup("scoped");
    const rules = [];
    for (const e of Object.values(entries)) {
      if (!e || typeof e !== "object" || !e.sel || !e.prop) continue;
      if (String(e.prop).startsWith("_")) continue;
      const sel = String(e.sel).replace(/[{}]/g, "").trim();
      const prop = String(e.prop).replace(/[^a-zA-Z-]/g, "");
      const val = String(e.value ?? "").replace(/[;{}]/g, "");
      if (!sel || !prop || !val) continue;
      rules.push(`${sel}{${prop}:${val} !important;}`);
    }
    return rules.join("");
  }

  function assetEntries() {
    const global = (store && store.assets) || {};
    const page = pageOverridesFor(location.pathname);
    const pageAssets = (page && page.assets) || {};
    return { ...global, ...pageAssets };
  }

  function safeSelector(sel) {
    const s = String(sel || "").replace(/[{}<>]/g, "").trim();
    return s || null;
  }

  function iconNode(markup, id) {
    const holder = document.createElement("div");
    holder.innerHTML = String(markup || "");
    const node = holder.firstElementChild;
    if (!node || node.nodeName.toLowerCase() !== "svg") return null;
    node.setAttribute("data-dse-asset", id);
    return node;
  }

  function applyAssets() {
    if (compareOn) return;
    const entries = assetEntries();
    const list = Object.values(entries).filter((e) => e && e.sel && e.data);
    const selectors = list.map((e) => safeSelector(e.sel)).filter(Boolean);
    if (
      !list.length &&
      !document.querySelector("[data-dse-swapped],[data-dse-asset],[data-dse-orig-src],[data-dse-orig-bg]")
    )
      return;
    const covered = (el) => {
      for (const s of selectors) {
        try {
          if (el.matches(s)) return true;
        } catch {}
      }
      return false;
    };

    for (const el of document.querySelectorAll("[data-dse-orig-src]")) {
      if (covered(el)) continue;
      const src = el.getAttribute("data-dse-orig-src");
      if (src) el.setAttribute("src", src);
      else el.removeAttribute("src");
      if (el.hasAttribute("data-dse-orig-srcset")) {
        el.setAttribute("srcset", el.getAttribute("data-dse-orig-srcset"));
        el.removeAttribute("data-dse-orig-srcset");
      } else {
        el.removeAttribute("srcset");
      }
      el.removeAttribute("data-dse-orig-src");
    }

    for (const el of document.querySelectorAll("[data-dse-orig-bg]")) {
      if (covered(el)) continue;
      const orig = el.getAttribute("data-dse-orig-bg");
      el.style.backgroundImage = orig || "";
      if (!orig) el.style.removeProperty("background-image");
      el.removeAttribute("data-dse-orig-bg");
    }

    for (const el of document.querySelectorAll("[data-dse-swapped]")) {
      if (covered(el)) continue;
      const rep = el.nextElementSibling;
      if (rep && rep.hasAttribute("data-dse-asset")) rep.remove();
      el.removeAttribute("data-dse-swapped");
    }

    for (const rep of document.querySelectorAll("[data-dse-asset]")) {
      const prev = rep.previousElementSibling;
      if (!prev || !prev.hasAttribute("data-dse-swapped")) rep.remove();
    }

    for (const [id, e] of Object.entries(entries)) {
      if (!e || !e.sel || !e.data) continue;
      const sel = safeSelector(e.sel);
      if (!sel) continue;
      let nodes = [];
      try {
        nodes = [...document.querySelectorAll(sel)];
      } catch {
        continue;
      }
      for (const el of nodes) {
        if (el.hasAttribute("data-dse-asset")) continue;
        if (e.kind === "img") {
          if (el.tagName !== "IMG") continue;
          if (el.getAttribute("src") === e.data) continue;
          if (!el.hasAttribute("data-dse-orig-src")) {
            el.setAttribute("data-dse-orig-src", el.getAttribute("src") || "");
            if (el.hasAttribute("srcset")) el.setAttribute("data-dse-orig-srcset", el.getAttribute("srcset"));
          }
          el.removeAttribute("srcset");
          el.setAttribute("src", e.data);
        } else if (e.kind === "bg") {
          const want = `url("${e.data}")`;
          if (el.style.backgroundImage === want) continue;
          if (!el.hasAttribute("data-dse-orig-bg")) el.setAttribute("data-dse-orig-bg", el.style.backgroundImage || "");
          el.style.backgroundImage = want;
        } else if (e.kind === "icon") {
          if (el.hasAttribute("data-dse-swapped")) {
            const rep = el.nextElementSibling;
            if (rep && rep.hasAttribute("data-dse-asset")) {
              if (rep.getAttribute("data-dse-asset") === id) continue;
              rep.remove();
            }
          }
          el.setAttribute("data-dse-swapped", id);
          const node = iconNode(e.data, id);
          if (node) el.insertAdjacentElement("afterend", node);
          else el.removeAttribute("data-dse-swapped");
        }
      }
    }
  }

  let assetTimer = 0;
  function scheduleAssets() {
    if (assetTimer) return;
    assetTimer = requestAnimationFrame(() => {
      assetTimer = 0;
      applyAssets();
    });
  }

  let resizeTimer = 0;
  function scheduleResize() {
    if (resizeTimer) return;
    resizeTimer = setTimeout(() => {
      resizeTimer = 0;
      try {
        window.dispatchEvent(new Event("resize"));
      } catch {}
    }, 120);
  }

  let compareOn = false;

  function restoreAssets() {
    for (const el of document.querySelectorAll("[data-dse-orig-src]")) {
      const src = el.getAttribute("data-dse-orig-src");
      if (src) el.setAttribute("src", src);
      else el.removeAttribute("src");
      if (el.hasAttribute("data-dse-orig-srcset")) {
        el.setAttribute("srcset", el.getAttribute("data-dse-orig-srcset"));
        el.removeAttribute("data-dse-orig-srcset");
      } else {
        el.removeAttribute("srcset");
      }
      el.removeAttribute("data-dse-orig-src");
    }
    for (const el of document.querySelectorAll("[data-dse-orig-bg]")) {
      const orig = el.getAttribute("data-dse-orig-bg");
      el.style.backgroundImage = orig || "";
      if (!orig) el.style.removeProperty("background-image");
      el.removeAttribute("data-dse-orig-bg");
    }
    for (const el of document.querySelectorAll("[data-dse-swapped]")) {
      const rep = el.nextElementSibling;
      if (rep && rep.hasAttribute("data-dse-asset")) rep.remove();
      el.removeAttribute("data-dse-swapped");
    }
    for (const rep of document.querySelectorAll("[data-dse-asset]")) rep.remove();
  }

  function restoreTexts() {
    const root = document.body;
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!origTexts.has(node)) continue;
      const orig = origTexts.get(node);
      if (node.nodeValue !== orig) node.nodeValue = orig;
    }
  }

  function setCompare(on) {
    compareOn = !!on;
    document.documentElement.toggleAttribute("data-dse-original", compareOn);
    for (const id of ["dse-tokens", "dse-shadows", "dse-font-rules", "dse-scoped", "dse-fonts"]) {
      const el = document.getElementById(id);
      if (el) el.disabled = compareOn;
    }
    if (compareOn) {
      restoreAssets();
      restoreTexts();
    } else {
      apply();
    }
  }

  const ACTIVE_CONCEPT_KEY = "dse.active.concept.v1";
  const THEMES_KEY = "dse.themes.v1";

  function syncPremiumPreset() {
    const link = document.getElementById("dse-premium-css");
    if (!link) return;
    let active = "";
    let preset = "";
    try {
      active = localStorage.getItem(ACTIVE_CONCEPT_KEY) || "";
      const themes = JSON.parse(localStorage.getItem(THEMES_KEY) || "{}");
      preset = themes && themes[active] && themes[active].preset ? themes[active].preset : "";
    } catch {}
    link.media = preset === "premium-2026" || active === "Socios Premium 2026" ? "all" : "not all";
  }

  function apply() {
    syncPremiumPreset();
    let el = document.getElementById("dse-tokens");
    if (!el) {
      el = document.createElement("style");
      el.id = "dse-tokens";
      document.documentElement.appendChild(el);
    }
    el.textContent = buildCss();
    let sel = document.getElementById("dse-shadows");
    if (!sel) {
      sel = document.createElement("style");
      sel.id = "dse-shadows";
      document.documentElement.appendChild(sel);
    }
    sel.textContent = buildShadowCss();
    let fr = document.getElementById("dse-font-rules");
    if (!fr) {
      fr = document.createElement("style");
      fr.id = "dse-font-rules";
      document.documentElement.appendChild(fr);
    }
    fr.textContent = buildFontRulesCss();
    let sc = document.getElementById("dse-scoped");
    if (!sc) {
      sc = document.createElement("style");
      sc.id = "dse-scoped";
      document.documentElement.appendChild(sc);
    }
    sc.textContent = buildScopedCss();
    if (!compareOn) {
      applyTexts();
      applyScopedTexts();
      applyAssets();
    }
    scheduleResize();
  }

  function loadTokens(next) {
    defaults();
    for (const group of ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"]) {
      store[group] = { ...(next && next[group] ? next[group] : {}) };
    }
    store.pages = {};
    if (next && next.pages) {
      for (const [route, page] of Object.entries(next.pages)) {
        store.pages[route] = {};
        for (const group of ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"]) {
          store.pages[route][group] = { ...(page && page[group] ? page[group] : {}) };
        }
      }
    }
    apply();
  }

  function setTokens(next) {
    loadTokens(next);
    persist();
  }

  function previewTokens(next) {
    loadTokens(next);
  }

  function setOne(group, name, value, route) {
    defaults();
    let target;
    if (route) {
      store.pages = store.pages || {};
      if (!store.pages[route]) store.pages[route] = {};
      if (!store.pages[route][group]) store.pages[route][group] = {};
      target = store.pages[route][group];
    } else {
      if (!store[group]) store[group] = {};
      target = store[group];
    }
    if (value === null || value === undefined || value === "") delete target[name];
    else target[name] = value;
    apply();
    persist();
  }

  function reset(group) {
    if (group) {
      if (store) delete store[group];
    } else {
      store = { v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, fontRules: {}, scoped: {}, assets: {}, pages: {} };
    }
    apply();
    persist();
  }

  const origTexts = new WeakMap();
  let textRaf = 0;
  let lastPath = location.pathname;

  function scheduleTexts() {
    if (textRaf) return;
    textRaf = requestAnimationFrame(() => {
      textRaf = 0;
      if (location.pathname !== lastPath) apply();
      else {
        applyTexts();
        applyScopedTexts();
      }
    });
  }

  function onRouteMaybe() {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      apply();
    }
    try {
      if (window.parent && window.parent !== window)
        window.parent.postMessage({ __dse: true, type: "route", path: location.pathname }, "*");
    } catch {}
  }

  const _push = history.pushState.bind(history);
  const _replace = history.replaceState.bind(history);
  history.pushState = function (...args) {
    const r = _push(...args);
    onRouteMaybe();
    return r;
  };
  history.replaceState = function (...args) {
    const r = _replace(...args);
    onRouteMaybe();
    return r;
  };
  window.addEventListener("popstate", onRouteMaybe);

  function applyScopedTexts() {
    if (compareOn) return;
    const entries = effectiveGroup("scoped");
    const root = document.body;
    if (!root) return;
    for (const e of Object.values(entries)) {
      if (!e || e.prop !== "_text" || !e.sel || e.value === undefined || e.value === null) continue;
      let nodes = [];
      try {
        nodes = [...document.querySelectorAll(e.sel)];
      } catch {
        continue;
      }
      const from = String(e.from || "").trim();
      const to = String(e.value);
      for (const el of nodes) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const t = node.nodeValue;
          if (!t || !t.trim()) continue;
          const orig = origTexts.get(node) ?? t;
          const key = orig.trim();
          if (from && key !== from && !key.includes(from)) continue;
          const next = from ? orig.replace(from, to) : to;
          if (next !== t) {
            origTexts.set(node, orig);
            node.nodeValue = next;
          } else if (!origTexts.has(node)) {
            origTexts.set(node, orig);
          }
          break;
        }
      }
    }
  }

  function applyTexts() {
    if (compareOn) return;
    const map = effectiveGroup("texts");
    const root = document.body;
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const t = node.nodeValue;
      if (!t || !t.trim()) continue;
      const orig = origTexts.get(node) ?? t;
      const key = orig.trim();
      const rep = map[key];
      if (rep !== undefined) {
        const next = orig.replace(key, rep);
        if (next !== t) {
          origTexts.set(node, orig);
          node.nodeValue = next;
        }
      } else if (origTexts.has(node) && t !== orig) {
        node.nodeValue = orig;
      }
    }
  }

  async function refreshFonts() {
    let list = [];
    try {
      const res = await fetch("/__dse/fonts");
      if (res.ok) list = await res.json();
    } catch {}
    const formats = { woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" };
    const rules = [];
    for (const f of Array.isArray(list) ? list : []) {
      const ext = ((f.file || "").match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
      const fam = String(f.family || "").replace(/["\\]/g, "");
      if (!fam) continue;
      rules.push(
        `@font-face{font-family:"${fam}";src:url(/__dse/fonts/${encodeURIComponent(f.file)})${
          formats[ext] ? ` format("${formats[ext]}")` : ""
        };${f.weight ? `font-weight:${f.weight};` : ""}${f.style ? `font-style:${String(f.style).replace(/[^a-z-]/gi, "")};` : ""}font-display:swap;}`
      );
    }
    let el = document.getElementById("dse-fonts");
    if (!el) {
      el = document.createElement("style");
      el.id = "dse-fonts";
      document.documentElement.appendChild(el);
    }
    el.textContent = rules.join("");
  }

  window.__dse = {
    key: KEY,
    get: () => store,
    load,
    apply,
    setTokens,
    previewTokens,
    setOne,
    reset,
    refreshFonts,
    applyAssets,
    setCompare,
    shadowDefaults: SHADOW_DEFAULTS,
  };

  load();
  apply();
  refreshFonts();
  addLauncher();

  function addLauncher() {
    if (document.getElementById("dse-open-editor")) return;
    const css = document.createElement("style");
    css.id = "dse-launcher-css";
    css.textContent = [
      "#dse-open-editor{position:fixed;left:16px;bottom:16px;z-index:40;display:inline-flex;align-items:center;gap:8px;",
      "padding:8px 14px;border-radius:var(--radius-full,9999px);background:var(--bg-brand);color:var(--text-on-brand);",
      "font:600 13px/1 var(--font-sans,Inter),sans-serif;text-decoration:none;border:1px solid var(--border-brand,transparent);",
      "box-shadow:0 8px 24px rgba(0,0,0,.25);}",
      "#dse-open-editor:hover{filter:brightness(1.08)}",
      "#dse-open-editor .dse-dot{width:8px;height:8px;border-radius:9999px;background:var(--text-on-brand);opacity:.85}",
    ].join("");
    document.documentElement.appendChild(css);
    const a = document.createElement("a");
    a.id = "dse-open-editor";
    a.href = "/__dse/editor";
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "Open the Design System Editor";
    const dot = document.createElement("span");
    dot.className = "dse-dot";
    const label = document.createElement("span");
    label.textContent = "Design editor";
    a.append(dot, label);
    document.documentElement.appendChild(a);
  }

  window.addEventListener("storage", (e) => {
    if (e.key === ACTIVE_CONCEPT_KEY || e.key === THEMES_KEY) {
      syncPremiumPreset();
      return;
    }
    if (e.key !== KEY) return;
    load();
    apply();
  });

  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || d.__dse !== true) return;
    if (d.type === "setTokens") setTokens(d.tokens || {});
    if (d.type === "setOne") setOne(d.group, d.name, d.value);
    if (d.type === "reset") reset(d.group);
    if (d.type === "apply") {
      load();
      apply();
    }
  });

  new MutationObserver(() => {
    if (!document.getElementById("dse-tokens")) apply();
  }).observe(document.documentElement, { childList: true, subtree: false });

  if (document.body) {
    new MutationObserver(scheduleTexts).observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    new MutationObserver(scheduleAssets).observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      new MutationObserver(scheduleTexts).observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      new MutationObserver(scheduleAssets).observe(document.body, { childList: true, subtree: true });
      applyTexts();
      applyAssets();
    });
  }
})();

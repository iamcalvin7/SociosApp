(() => {
  const KEY = "dse.tokens.v1";
  const iframe = document.getElementById("preview");
  const els = {
    groupNav: document.getElementById("groupNav"),
    tokenList: document.getElementById("tokenList"),
    groupTitle: document.getElementById("groupTitle"),
    filter: document.getElementById("filter"),
    onlyEdited: document.getElementById("onlyEdited"),
    themeTabs: document.getElementById("themeTabs"),
    previewPage: document.getElementById("previewPage"),
    btnReload: document.getElementById("btnReload"),
    btnNewTab: document.getElementById("btnNewTab"),
    btnExport: document.getElementById("btnExport"),
    btnImport: document.getElementById("btnImport"),
    importFile: document.getElementById("importFile"),
    assetFile: document.getElementById("assetFile"),
    btnResetAll: document.getElementById("btnResetAll"),
    toast: document.getElementById("toast"),
    btnPick: document.getElementById("btnPick"),
    pickHint: document.getElementById("pickHint"),
    pickResult: document.getElementById("pickResult"),
    btnSaveTheme: document.getElementById("btnSaveTheme"),
    themeList: document.getElementById("themeList"),
    themeBadge: document.getElementById("themeBadge"),
    scopeSelect: document.getElementById("scopeSelect"),
    btnRemoveScope: document.getElementById("btnRemoveScope"),
    previewStateTabs: document.getElementById("previewStateTabs"),
    layout: document.querySelector(".layout"),
    previewGrip: document.getElementById("previewGrip"),
    semNav: document.getElementById("semNav"),
    kitList: document.getElementById("themeList"),
    btnNewKit: document.getElementById("btnNewKit"),
    btnDupKit: document.getElementById("btnDupKit"),
    btnRenameKit: document.getElementById("btnRenameKit"),
    btnUndo: document.getElementById("btnUndo"),
    btnRedo: document.getElementById("btnRedo"),
    historyCount: document.getElementById("historyCount"),
    btnHandoff: document.getElementById("btnHandoff"),
    compareSwitch: document.getElementById("compareSwitch"),
    compareNote: document.getElementById("compareNote"),
    scopeToggle: document.getElementById("scopeToggle"),
    advancedBox: document.getElementById("advancedBox"),
    libFile: document.getElementById("libFile"),
    conceptSelect: document.getElementById("conceptSelect"),
    conceptMenu: document.getElementById("conceptMenu"),
    conceptMenuBtn: document.getElementById("conceptMenuBtn"),
    savedState: document.getElementById("savedState"),
    btnUploadTheme: document.getElementById("btnUploadTheme"),
    themeFile: document.getElementById("themeFile"),
    themePanel: document.getElementById("themePanel"),
    themeTitle: document.getElementById("themeTitle"),
    themeBody: document.getElementById("themeBody"),
    themeClose: document.getElementById("themeClose"),
    btnThemePreview: document.getElementById("btnThemePreview"),
    btnThemeAdd: document.getElementById("btnThemeAdd"),
    btnThemeCancel: document.getElementById("btnThemeCancel"),
    btnSelectMain: document.getElementById("btnSelectMain"),
    btnBrandMain: document.getElementById("btnBrandMain"),
    btnAdvanced: document.getElementById("btnAdvanced"),
    btnCloseAdvanced: document.getElementById("btnCloseAdvanced"),
    advancedDrawer: document.getElementById("advancedDrawer"),
    simpleInspector: document.getElementById("simpleInspector"),
    siKind: document.getElementById("siKind"),
    siName: document.getElementById("siName"),
    siBody: document.getElementById("siBody"),
    siClose: document.getElementById("siClose"),
    siSimilarWrap: document.getElementById("siSimilarWrap"),
    siSimilar: document.getElementById("siSimilar"),
    siReset: document.getElementById("siReset"),
    brandPanel: document.getElementById("brandPanel"),
    brandBody: document.getElementById("brandBody"),
    brandClose: document.getElementById("brandClose"),
    exportPanel: document.getElementById("exportPanel"),
    exportClose: document.getElementById("exportClose"),
    exportReport: document.getElementById("exportReport"),
    developerReport: document.getElementById("developerReport"),
    btnCopyChanges: document.getElementById("btnCopyChanges"),
    btnExportJson: document.getElementById("btnExportJson"),
    btnExportAssets: document.getElementById("btnExportAssets"),
  };

  let defaults = null;
  let fonts = [];
  let store = null;
  let theme = "dark";
  let group = "semantic";
  let section = "brand";
  let scope = "universal";
  let usage = null;
  let shadowUsed = new Set();
  let showUnused = false;
  let flashTarget = null;
  let flashTimer = 0;
  let previewState = "member";
  let toastTimer = 0;
  let advancedOpen = false;
  let simpleSelection = null;
  let savedTimer = 0;
  let autosaveTimer = 0;
  let pendingTheme = null;
  let themePreviewSnapshot = null;
  let themePreviewOn = false;
  let themeErrors = null;

  const SOCIOS_CFG_KEY = "socios.homeconfig.v1";
  const SOCIOS_OVERRIDE_KEY = "socios.presentation.override.v1";
  const SOCIOS_ONBOARDING_KEY = "socios.onboarding.session.v3";
  const SOCIOS_SEEN_KEY = "socios.seen.v1";
  const PREVIEW_STATE_KEY = "dse.preview.state.v1";

  const DEFAULT_SOCIOS_CONFIG = {
    version: 26,
    nav: "sidebar-v2",
    theme: { scheme: "default", mode: "light", club: null, invertChrome: false },
    future: false,
    ladderVariant: "mvp",
    fto: "live",
    layout: [
      { id: "price-tape", span: { col: 12, row: 1 }, visible: true },
      { id: "portfolio", span: { col: 12, row: 4 }, visible: true },
      { id: "fto", span: { col: 12, row: 3 }, visible: true },
      { id: "fixtures", span: { col: 12, row: 4 }, visible: true },
      { id: "auctions", span: { col: 6, row: 3 }, visible: true },
      { id: "polls", span: { col: 6, row: 3 }, visible: true },
      { id: "markets", span: { col: 6, row: 4 }, visible: true },
      { id: "socios-token", span: { col: 3, row: 4 }, visible: true },
      { id: "prepaid-card", span: { col: 3, row: 4 }, visible: true },
      { id: "notifications", span: { col: 6, row: 4 }, visible: true },
      { id: "whale-watch", span: { col: 6, row: 4 }, visible: true },
      { id: "concierge", span: { col: 4, row: 4 }, visible: true },
      { id: "socios-activity", span: { col: 4, row: 4 }, visible: true },
      { id: "quick-swap", span: { col: 4, row: 4 }, visible: true },
      { id: "raffle", span: { col: 4, row: 4 }, visible: true },
      { id: "pulse", span: { col: 4, row: 4 }, visible: true },
      { id: "discover-teams", span: { col: 4, row: 4 }, visible: true },
    ],
    auth: "guest",
  };

  function sociosEncode(cfg) {
    return btoa(JSON.stringify(cfg)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function sociosDecode(v) {
    try {
      return JSON.parse(atob(String(v).replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return null;
    }
  }

  function applyPreviewState(state) {
    previewState = state === "guest" ? "guest" : "member";
    try {
      localStorage.setItem(PREVIEW_STATE_KEY, previewState);
    } catch {}
    try {
      let cfg = sociosDecode(localStorage.getItem(SOCIOS_CFG_KEY));
      if (!cfg || typeof cfg !== "object" || cfg.version !== DEFAULT_SOCIOS_CONFIG.version || !Array.isArray(cfg.layout))
        cfg = JSON.parse(JSON.stringify(DEFAULT_SOCIOS_CONFIG));
      cfg.auth = previewState === "member" ? "passkey" : "guest";
      localStorage.setItem(SOCIOS_CFG_KEY, sociosEncode(cfg));
      localStorage.removeItem(SOCIOS_OVERRIDE_KEY);
      localStorage.removeItem(SOCIOS_ONBOARDING_KEY);
      localStorage.removeItem(SOCIOS_SEEN_KEY);
    } catch {}
  }

  function renderPreviewState() {
    if (!els.previewStateTabs) return;
    for (const b of els.previewStateTabs.querySelectorAll("button")) {
      b.setAttribute("aria-selected", String(b.dataset.state === previewState));
    }
  }

  if (els.previewStateTabs)
    els.previewStateTabs.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-state]");
      if (!b || b.dataset.state === previewState) return;
      applyPreviewState(b.dataset.state);
      renderPreviewState();
      try {
        iframe.src = iframe.src;
      } catch {}
    });

  const PREVIEW_WIDTH_KEY = "dse.preview.width.v1";
  const PREVIEW_FRAC_DEFAULT = 0.44;
  let previewFrac = null;

  function clampFrac(f) {
    return Math.min(0.72, Math.max(0.24, f));
  }

  function applyPreviewFrac() {
    if (!els.layout) return;
    if (!previewFrac || window.matchMedia("(max-width: 1100px)").matches) {
      els.layout.style.gridTemplateColumns = "";
      return;
    }
    els.layout.style.gridTemplateColumns = `220px minmax(320px, 1fr) 6px minmax(320px, ${Math.round(previewFrac * 1000) / 10}%)`;
  }

  function persistPreviewFrac() {
    try {
      if (previewFrac === null) localStorage.removeItem(PREVIEW_WIDTH_KEY);
      else localStorage.setItem(PREVIEW_WIDTH_KEY, String(Math.round(previewFrac * 1000) / 1000));
    } catch {}
  }

  function initPreviewGrip() {
    const grip = els.previewGrip;
    if (!grip) return;
    if (!grip) return;
    try {
      const saved = parseFloat(localStorage.getItem(PREVIEW_WIDTH_KEY));
      if (Number.isFinite(saved)) previewFrac = clampFrac(saved);
    } catch {}
    applyPreviewFrac();
    let dragging = false;
    let startX = 0;
    let startFrac = PREVIEW_FRAC_DEFAULT;
    const onMove = (e) => {
      if (!dragging) return;
      const total = els.layout.getBoundingClientRect().width;
      if (!total) return;
      previewFrac = clampFrac(startFrac + (e.clientX - startX) / total);
      applyPreviewFrac();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      grip.classList.remove("dragging");
      document.body.classList.remove("dse-resizing");
      persistPreviewFrac();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    grip.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      startFrac = previewFrac ?? PREVIEW_FRAC_DEFAULT;
      grip.classList.add("dragging");
      document.body.classList.add("dse-resizing");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });
    grip.addEventListener("dblclick", () => {
      previewFrac = null;
      persistPreviewFrac();
      applyPreviewFrac();
    });
    grip.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      previewFrac = clampFrac((previewFrac ?? PREVIEW_FRAC_DEFAULT) + (e.key === "ArrowRight" ? 0.03 : -0.03));
      applyPreviewFrac();
      persistPreviewFrac();
    });
    window.addEventListener("resize", applyPreviewFrac);
  }

  const ROUTE_PRESETS = [    "/",
    "/market",
    "/earn",
    "/rewards",
    "/rewards/browse",
    "/rewards/search",
    "/rewards/watchlist",
    "/reward-points",
    "/browser",
    "/design-system",
    "/fan-token-play",
    "/polls",
    "/pulse",
    "/search",
    "/wallet",
    "/wallet/activity",
    "/equity",
    "/equity/offering",
  ];

  function pageStore(route) {
    if (!store.pages[route])
      store.pages[route] = { global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, scoped: {}, assets: {} };
    return store.pages[route];
  }

  function scopeStore(sc, route) {
    const r = route === undefined ? scope : route;
    if (!r || r === "universal") {
      if (!store[sc]) store[sc] = {};
      return store[sc];
    }
    const page = pageStore(r);
    if (!page[sc]) page[sc] = {};
    return page[sc];
  }

  function pageOverride(sc, key) {
    if (scope === "universal") return undefined;
    const page = store.pages[scope];
    return page && page[sc] ? page[sc][key] : undefined;
  }

  function effectiveLabel(sc, key) {
    const p = pageOverride(sc, key);
    if (p !== undefined) return `${p} (page)`;
    const u = store[sc] ? store[sc][key] : undefined;
    if (u !== undefined) return `${u} (all pages)`;
    return defaultValue(sc, key) ?? "";
  }

  function getPreviewPath() {
    try {
      return iframe.contentWindow.location.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return null;
    }
  }

  function updateScopeToggle() {
    if (!els.scopeToggle) return;
    for (const b of els.scopeToggle.querySelectorAll("button[data-scope]")) {
      const on = b.dataset.scope === "universal" ? scope === "universal" : scope !== "universal";
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    }
  }

  function renderPageOptions() {
    const sel = els.previewPage;
    if (!sel) return;
    const cur = sel.value;
    const routes = new Set(ROUTE_PRESETS);
    const here = getPreviewPath();
    if (here) routes.add(here);
    for (const r of Object.keys(store.pages || {})) routes.add(r);
    sel.textContent = "";
    for (const r of routes) sel.appendChild(new Option(prettyRoute(r) + " — " + r, r));
    if (cur && [...sel.options].some((o) => o.value === cur)) sel.value = cur;
    const active = scope !== "universal" ? scope : getPreviewPath();
    if (active && [...sel.options].some((o) => o.value === active)) sel.value = active;
  }

  function renderScope() {
    updateScopeToggle();
    const sel = els.scopeSelect;
    if (!sel) return;
    sel.textContent = "";
    const uni = document.createElement("option");
    uni.value = "universal";
    uni.textContent = "All pages (universal)";
    sel.appendChild(uni);
    const routes = new Set(ROUTE_PRESETS);
    const cur = getPreviewPath();
    if (cur) routes.add(cur);
    for (const r of Object.keys(store.pages || {})) routes.add(r);
    if (scope !== "universal") routes.add(scope);
    const og = document.createElement("optgroup");
    og.label = "Page scopes";
    for (const r of [...routes].sort()) {
      const o = document.createElement("option");
      o.value = r;
      o.textContent = r + (store.pages[r] && Object.keys(store.pages[r]).some((g) => Object.keys(store.pages[r][g] || {}).length) ? " *" : "");
      og.appendChild(o);
    }
    sel.appendChild(og);
    sel.value = scope;
    if (els.btnRemoveScope) {
      const pageDirty =
        scope !== "universal" &&
        store.pages[scope] &&
        Object.values(store.pages[scope]).some((g) => Object.keys(g || {}).length > 0);
      els.btnRemoveScope.hidden = !pageDirty;
    }
  }

  const THEMES_KEY = "dse.themes.v1";
  const ACTIVE_CONCEPT_KEY = "dse.active.concept.v1";
  let themes = {};
  let activeThemeName = null;
  let dirty = false;

  function rememberActiveConcept() {
    try {
      if (activeThemeName) localStorage.setItem(ACTIVE_CONCEPT_KEY, activeThemeName);
      else localStorage.removeItem(ACTIVE_CONCEPT_KEY);
    } catch {}
  }

  function loadThemes() {
    try {
      themes = JSON.parse(localStorage.getItem(THEMES_KEY) || "{}");
    } catch {
      themes = {};
    }
  }

  function saveThemes() {
    try {
      localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
    } catch {}
  }

  function updateThemeBadge() {
    if (!els.themeBadge) return;
    if (!activeThemeName) {
      els.themeBadge.hidden = true;
      return;
    }
    els.themeBadge.hidden = false;
    els.themeBadge.textContent = activeThemeName + (dirty ? " •" : "");
  }

  function renderThemes() {
    if (!els.themeList) return;
    els.themeList.textContent = "";
    const names = Object.keys(themes).sort((a, b) => (themes[b].savedAt || 0) - (themes[a].savedAt || 0));
    if (!names.length) {
      const p = document.createElement("p");
      p.className = "theme-empty";
      p.textContent = "No saved kits yet.";
      els.themeList.appendChild(p);
      return;
    }
    for (const name of names) {
      const row = document.createElement("div");
      row.className = "theme-item";
      const load = document.createElement("button");
      load.className = "theme-load" + (name === activeThemeName ? " active" : "");
      load.textContent = name;
      load.title = "Load kit " + name;
      load.onclick = () => loadTheme(name);
      const del = document.createElement("button");
      del.className = "theme-del";
      del.textContent = "×";
      del.title = "Delete kit " + name;
      del.onclick = () => {
        delete themes[name];
        saveThemes();
        if (activeThemeName === name) {
          activeThemeName = null;
          rememberActiveConcept();
        }
        renderThemes();
        updateThemeBadge();
      };
      row.append(load, del);
      els.themeList.appendChild(row);
    }
  }

  function loadTheme(name) {
    closeThemePanel();
    const snap = themes[name] && themes[name].data;
    if (!snap) return;
    store = JSON.parse(JSON.stringify(snap));
    for (const g of ["global", "palette", "dark", "light", "shadows", "texts", "fontRules"]) if (!store[g]) store[g] = {};
    if (!store.pages) store.pages = {};
    saveStore();
    try {
      iframe.contentWindow.__dse?.setTokens?.(store);
    } catch {}
    activeThemeName = name;
    dirty = false;
    rememberActiveConcept();
    refreshAll();
    showToast(`Loaded kit "${name}"`);
  }

  function saveTheme() {
    const existing = Object.keys(themes).length;
    const name = prompt("Save current brand kit as:", activeThemeName || `Kit ${existing + 1}`);
    if (!name || !name.trim()) return;
    themes[name.trim()] = { savedAt: Date.now(), data: JSON.parse(JSON.stringify(store)) };
    saveThemes();
    activeThemeName = name.trim();
    dirty = false;
    rememberActiveConcept();
    renderThemes();
    updateThemeBadge();
    showToast(`Saved kit "${name.trim()}"`);
  }

  if (els.btnSaveTheme) els.btnSaveTheme.addEventListener("click", saveTheme);

  function createKit(name) {
    const clean = String(name || "").trim();
    if (!clean) return null;
    themes[clean] = { savedAt: Date.now(), data: JSON.parse(JSON.stringify(store)) };
    saveThemes();
    activeThemeName = clean;
    dirty = false;
    rememberActiveConcept();
    refreshAll();
    showToast(`Saved kit "${clean}"`);
    return clean;
  }

  if (els.btnNewKit)
    els.btnNewKit.onclick = () => {
      const name = prompt("Name this brand kit:", `Kit ${Object.keys(themes).length + 1}`);
      if (!name) return;
      if (themes[name.trim()] && !confirm(`Replace existing kit "${name.trim()}"?`)) return;
      createKit(name);
    };

  if (els.btnDupKit)
    els.btnDupKit.onclick = () => {
      const source = activeThemeName && themes[activeThemeName] ? themes[activeThemeName].data : store;
      const name = prompt("Duplicate as:", activeThemeName ? `${activeThemeName} copy` : "New kit");
      if (!name || !name.trim()) return;
      themes[name.trim()] = { savedAt: Date.now(), data: JSON.parse(JSON.stringify(source)) };
      saveThemes();
      activeThemeName = name.trim();
      dirty = false;
      rememberActiveConcept();
      refreshAll();
      showToast(`Duplicated to "${name.trim()}"`);
    };

  if (els.btnRenameKit)
    els.btnRenameKit.onclick = () => {
      if (!activeThemeName || !themes[activeThemeName]) {
        showToast("Save or load a kit first");
        return;
      }
      const name = prompt("Rename kit:", activeThemeName);
      if (!name || !name.trim() || name.trim() === activeThemeName) return;
      if (themes[name.trim()] && !confirm(`Replace existing kit "${name.trim()}"?`)) return;
      themes[name.trim()] = themes[activeThemeName];
      delete themes[activeThemeName];
      activeThemeName = name.trim();
      rememberActiveConcept();
      saveThemes();
      refreshAll();
      showToast(`Renamed to "${name.trim()}"`);
    };

  if (els.conceptSelect)
    els.conceptSelect.addEventListener("change", () => {
      const v = els.conceptSelect.value;
      closeThemePanel();
      if (v === "__current") {
        activeThemeName = null;
        rememberActiveConcept();
        dirty = true;
        updateThemeBadge();
        renderConceptSelect();
        setSavedState("Saved");
        return;
      }
      if (themes[v]) loadTheme(v);
    });

  if (els.conceptMenuBtn && els.conceptMenu)
    els.conceptMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      els.conceptMenu.hidden = !els.conceptMenu.hidden;
    });

  document.addEventListener("click", (e) => {
    if (!els.conceptMenu || els.conceptMenu.hidden) return;
    if (e.target.closest("#conceptMenu") || e.target.closest("#conceptMenuBtn")) return;
    els.conceptMenu.hidden = true;
  });

  if (els.conceptMenu)
    els.conceptMenu.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-concept]");
      if (!b) return;
      els.conceptMenu.hidden = true;
      const action = b.dataset.concept;
      if (action === "new") {
        const name = prompt("Name the new concept:", `Concept ${Object.keys(themes).length + 1}`);
        if (!name || !name.trim()) return;
        if (themes[name.trim()] && !confirm(`Replace existing concept "${name.trim()}"?`)) return;
        createKit(name.trim());
      } else if (action === "duplicate") {
        const source = activeThemeName && themes[activeThemeName] ? themes[activeThemeName].data : store;
        const name = prompt("Duplicate as:", activeThemeName ? `${activeThemeName} copy` : "New concept");
        if (!name || !name.trim()) return;
        if (themes[name.trim()] && !confirm(`Replace existing concept "${name.trim()}"?`)) return;
        themes[name.trim()] = { savedAt: Date.now(), data: JSON.parse(JSON.stringify(source)) };
        activeThemeName = name.trim();
        rememberActiveConcept();
        dirty = false;
        saveThemes();
        refreshAll();
        showToast(`Duplicated to "${name.trim()}"`);
      } else if (action === "rename") {
        if (!activeThemeName || !themes[activeThemeName]) {
          showToast("Choose a saved concept first");
          return;
        }
        const name = prompt("Rename concept:", activeThemeName);
        if (!name || !name.trim() || name.trim() === activeThemeName) return;
        if (themes[name.trim()] && !confirm(`Replace existing concept "${name.trim()}"?`)) return;
        themes[name.trim()] = themes[activeThemeName];
        delete themes[activeThemeName];
        activeThemeName = name.trim();
        rememberActiveConcept();
        saveThemes();
        refreshAll();
        showToast(`Renamed to "${name.trim()}"`);
      } else if (action === "builtin") {
        openBuiltinTheme();
      } else if (action === "delete") {
        if (!activeThemeName || !themes[activeThemeName]) {
          showToast("Choose a saved concept first");
          return;
        }
        if (!confirm(`Delete concept "${activeThemeName}"?`)) return;
        delete themes[activeThemeName];
        activeThemeName = null;
        rememberActiveConcept();
        dirty = true;
        saveThemes();
        refreshAll();
        showToast("Concept deleted");
      }
    });

  if (els.btnUndo) els.btnUndo.onclick = undo;
  if (els.btnRedo) els.btnRedo.onclick = redo;

  function openHandoff() {
    section = "handoff";
    renderSemNav();
    renderCenter();
  }
  if (els.btnHandoff) els.btnHandoff.onclick = openHandoff;

  if (els.scopeToggle)
    els.scopeToggle.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-scope]");
      if (!b) return;
      const want = b.dataset.scope;
      if (want === "page") {
        scope = getPreviewPath() || "/";
        els.previewPage.value = scope;
      } else {
        scope = "universal";
      }
      refreshAll();
      showToast(scope === "universal" ? "Editing all pages" : `Editing ${prettyRoute(scope)} only`);
    });

  const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

  function ensureStoreGroups() {
    for (const g of ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"]) {
      if (!store[g]) store[g] = {};
    }
    if (!store.pages) store.pages = {};
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(KEY);
      store = raw
        ? JSON.parse(raw)
        : { v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, fontRules: {}, scoped: {}, pages: {} };
    } catch {
      store = { v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, fontRules: {}, scoped: {}, pages: {} };
    }
    ensureStoreGroups();
    lastWritten = JSON.stringify(store);
  }

  let lastWritten = null;
  const undoStack = [];
  const redoStack = [];

  function updateHistoryUI() {
    const n = undoStack.length;
    if (els.historyCount) els.historyCount.textContent = `${n} ${n === 1 ? "change" : "changes"}`;
    if (els.btnUndo) els.btnUndo.disabled = !n;
    if (els.btnRedo) els.btnRedo.disabled = !redoStack.length;
  }

  function setSavedState(text, saving) {
    if (!els.savedState) return;
    els.savedState.textContent = text;
    els.savedState.classList.toggle("saving", !!saving);
  }

  function scheduleConceptAutosave() {
    if (!activeThemeName) {
      setSavedState("Saved");
      return;
    }
    clearTimeout(autosaveTimer);
    setSavedState("Saving…", true);
    autosaveTimer = setTimeout(() => {
      if (!activeThemeName) return;
      themes[activeThemeName] = {
        ...(themes[activeThemeName] || {}),
        savedAt: Date.now(),
        data: JSON.parse(JSON.stringify(store)),
      };
      saveThemes();
      dirty = false;
      updateThemeBadge();
      renderConceptSelect();
      setSavedState("Saved");
    }, 260);
  }

  function renderConceptSelect() {
    const sel = els.conceptSelect;
    if (!sel) return;
    const names = Object.keys(themes).sort((a, b) => (themes[b].savedAt || 0) - (themes[a].savedAt || 0));
    sel.textContent = "";
    sel.appendChild(new Option("Current", "__current"));
    for (const name of names) sel.appendChild(new Option(name, name));
    sel.value = activeThemeName && themes[activeThemeName] ? activeThemeName : "__current";
    if (els.btnRenameKit) els.btnRenameKit.disabled = !activeThemeName;
    if (els.btnDupKit) els.btnDupKit.disabled = false;
  }

  function renderCompareButtons() {
    for (const b of els.compareSwitch ? els.compareSwitch.querySelectorAll("button") : []) {
      b.classList.toggle("active", b.dataset.compare === (compareOn ? "original" : "concept"));
    }
  }

  function updateSelectAction() {
    if (!els.btnSelectMain) return;
    els.btnSelectMain.classList.toggle("active", pick.on);
    els.btnSelectMain.textContent = pick.on ? "Cancel selecting" : "Select something";
  }

  function renderSimpleUI() {
    renderConceptSelect();
    renderCompareButtons();
    updateSelectAction();
    updateHistoryUI();
    if (!els.savedState || !els.savedState.textContent) setSavedState("Saved");
    if (simpleSelection && (!simpleSelection.el || !simpleSelection.el.isConnected)) closeSimpleInspector();
  }

  function refreshAll() {
    renderSimpleUI();
    if (advancedOpen) {
      renderSemNav();
      renderGroups();
      renderCenter();
      renderScope();
    }
    renderThemes();
    updateThemeBadge();
  }

  function saveStore(opts = {}) {
    const next = JSON.stringify(store);
    if (!opts.silent && lastWritten !== null && next !== lastWritten) {
      undoStack.push(lastWritten);
      if (undoStack.length > 80) undoStack.shift();
      redoStack.length = 0;
    }
    lastWritten = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    updateHistoryUI();
    scheduleConceptAutosave();
  }

  function undo() {
    closeThemePanel();
    if (!undoStack.length) return;
    redoStack.push(lastWritten);
    store = JSON.parse(undoStack.pop());
    ensureStoreGroups();
    saveStore({ silent: true });
    sendToFrame("setTokens", store);
    refreshAll();
    showToast("Undone");
  }

  function redo() {
    closeThemePanel();
    if (!redoStack.length) return;
    undoStack.push(lastWritten);
    store = JSON.parse(redoStack.pop());
    ensureStoreGroups();
    saveStore({ silent: true });
    sendToFrame("setTokens", store);
    refreshAll();
    showToast("Redone");
  }

  function sendToFrame(method, ...args) {
    try {
      iframe.contentWindow.__dse?.[method]?.(...args);
    } catch {}
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function copy(text) {
    const done = () => showToast("Copied: " + text);
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(done, done);
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {}
    ta.remove();
    done();
  }

  function parseSize(v) {
    const m = /^(-?[\d.]+)(rem|px)?$/.exec(String(v).trim());
    return m ? { n: parseFloat(m[1]), u: m[2] || "px" } : null;
  }

  function fmtSize(n, u) {
    return (Math.round(n * 1000) / 1000) + u;
  }

  function rgbToHex(rgb) {
    const s = String(rgb || "").trim();
    let vals = null;
    let m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/.exec(s);
    if (m) {
      if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
      vals = [+m[1], +m[2], +m[3]];
    } else {
      m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/.exec(s);
      if (!m) return null;
      if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
      vals = [+m[1] * 255, +m[2] * 255, +m[3] * 255];
    }
    const hex = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
    return "#" + hex(vals[0]) + hex(vals[1]) + hex(vals[2]);
  }

  function probe(varName, prop) {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc || !doc.body) return null;
    const prev = doc.documentElement.getAttribute("data-theme");
    doc.documentElement.setAttribute("data-theme", theme);
    const span = doc.createElement("span");
    span.style.cssText = `${prop}: var(${varName}); position:absolute; visibility:hidden; pointer-events:none;`;
    doc.body.appendChild(span);
    let out = null;
    try {
      out = win.getComputedStyle(span).getPropertyValue(prop);
    } catch {}
    span.remove();
    if (prev === null) doc.documentElement.removeAttribute("data-theme");
    else doc.documentElement.setAttribute("data-theme", prev);
    return out;
  }

  function luminance([r, g, b]) {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function contrast(a, b) {
    const L1 = luminance(a);
    const L2 = luminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }

  function parseRgb(s) {
    const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(s || "");
    return m ? [ +m[1], +m[2], +m[3] ] : null;
  }

  const CONTRAST_PAIRS = {
    "--text-primary": ["--bg-screen", "--bg-container"],
    "--text-subtle": ["--bg-container"],
    "--text-disabled": ["--bg-container"],
    "--text-on-brand": ["--bg-brand"],
    "--text-brand": ["--bg-screen", "--bg-container"],
    "--text-price-up": ["--bg-screen", "--bg-container"],
    "--text-price-down": ["--bg-screen", "--bg-container"],
    "--text-success": ["--bg-container"],
    "--text-warning": ["--bg-container"],
    "--text-error": ["--bg-container"],
    "--text-inverse": ["--bg-inverse"],
    "--icon-primary": ["--bg-screen", "--bg-container"],
    "--border-divider": ["--bg-container"],
    "--border-unselected": ["--bg-container"],
    "--border-brand": ["--bg-container"],
  };

  const TEXT_RE = /^--(text|leading)-/;
  const GROUPS = [
    { id: "palette", title: "Colour primitives", scope: "palette", kind: "color", keys: () => Object.keys(defaults.palette).sort() },
    {
      id: "semantic",
      title: "Semantic colours",
      scope: () => theme,
      kind: "color",
      keys: () => [...new Set([...Object.keys(defaults.dark), ...Object.keys(defaults.light)])].sort(),
    },
    {
      id: "typography",
      title: "Typography",
      scope: "global",
      keys: () => Object.keys(defaults.global).filter((k) => /^(--text-|--leading-|--font-(regular|semibold|bold|black))/.test(k)),
      kindOf: (k) => (/^--font-(regular|semibold|bold|black)/.test(k) ? "number" : "size"),
      slider: (k) => (/^--text-/.test(k) ? { min: 8, max: 120, step: 1 } : { min: 8, max: 120, step: 1 }),
    },
    {
      id: "buttons",
      title: "Buttons & CTAs",
      keys: () => [
        ["--primary", "global", "color"],
        ["--primary-foreground", "global", "color"],
        ["--button-primary", "global", "color"],
        ["--ring", "global", "color"],
        ["--bg-brand", "theme", "color"],
        ["--bg-brand-selected", "theme", "color"],
        ["--bg-brand-accessible", "theme", "color"],
        ["--bg-brand-subtle", "theme", "color"],
        ["--text-on-brand", "theme", "color"],
        ["--border-brand", "theme", "color"],
        ["--radius", "global", "size"],
      ],
    },
    {
      id: "spacing",
      title: "Spacing & layout",
      scope: "global",
      keys: () => Object.keys(defaults.global).filter((k) => /^(--spacing$|--space-|--page-gutter|--container-)/.test(k)),
      kindOf: (k) => "size",
      slider: (k) => (k === "--spacing" ? { min: 0, max: 0.75, step: 0.005 } : { min: 0, max: 200, step: 1 }),
    },
    {
      id: "radius",
      title: "Radius",
      scope: "global",
      keys: () => ["--radius", "--radius-xs", "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-full"],
      kindOf: () => "size",
      slider: (k) => (k === "--radius" ? { min: 0, max: 2, step: 0.05 } : { min: 0, max: 64, step: 1 }),
    },
    { id: "shadows", title: "Shadows", scope: "shadows", kind: "shadow", keys: () => ["sm", "md", "lg", "xl"] },
    {
      id: "texts",
      title: "Renamed labels",
      scope: "texts",
      kind: "text",
      keys: () => [...new Set([...Object.keys(store.texts || {}), ...Object.keys(rawGroup("texts"))])].sort(),
    },
    {
      id: "assets",
      title: "Visuals & icons",
      scope: "assets",
      kind: "assets",
      keys: () => Object.keys(rawGroup("assets")).sort(),
    },
    {
      id: "scoped",
      title: "Scoped overrides",
      scope: "scoped",
      kind: "scoped",
      keys: () => Object.keys(rawGroup("scoped")).sort(),
    },
  ];

  function scopeOf(g) {
    return typeof g.scope === "function" ? g.scope() : g.scope;
  }

  function groupKeys(g) {
    if (g.id === "buttons") return g.keys();
    const set = g.keys();
    const order = set.sort((a, b) => a.localeCompare(b));
    return order;
  }

  function rawGroup(sc) {
    if (scope === "universal") return (store && store[sc]) || {};
    return ((store.pages[scope] || {})[sc]) || {};
  }

  function getOverride(sc, key) {
    const page = pageOverride(sc, key);
    if (page !== undefined) return page;
    return store[sc] && store[sc][key] !== undefined ? store[sc][key] : null;
  }

  function hasOwnOverride(sc, key) {
    return rawGroup(sc)[key] !== undefined;
  }

  function defaultValue(sc, key) {
    if (sc === "palette") return defaults.palette[key];
    if (sc === "dark") return defaults.dark[key];
    if (sc === "light") return defaults.light[key];
    return defaults.global[key];
  }

  function setTokenBlock(sc, key, value, route) {
    const target = scopeStore(sc, route);
    if (value === null || value === "" || value === undefined) delete target[key];
    else target[key] = value;
  }

  function setTokenBatch(updates, opts = {}) {
    for (const u of updates) {
      if (!u || !u.key) continue;
      setTokenBlock(u.group, u.key, u.value, u.route === undefined ? routeForScope() : u.route);
    }
    saveStore();
    sendToFrame("setTokens", store);
    dirty = true;
    updateNavCounts();
    renderSemNav();
    updateThemeBadge();
    if (opts.rerender) renderCenter();
  }

  function setToken(sc, key, value, route) {
    const target = scopeStore(sc, route);
    if (value === null || value === "") {
      delete target[key];
    } else {
      target[key] = value;
    }
    saveStore();
    pushToFrame("setOne", { group: sc, name: key, value, route: route && route !== "universal" ? route : null });
    syncRow(sc, key);
    updateNavCounts();
    dirty = true;
    updateThemeBadge();
  }

  function syncRow(sc, key) {
    const row = els.tokenList.querySelector(`.token-row[data-token="${CSS.escape(key)}"][data-scope="${CSS.escape(sc)}"]`);
    if (!row) return;
    const ov = getOverride(sc, key);
    const def = defaultValue(sc, key);
    const kind = row.dataset.kind;
    row.classList.toggle("edited", !!ov);
    row.classList.toggle("finding", isFinding(sc, key));
    const label = row.querySelector(".token-main .token-value");
    if (kind === "family") {
      if (label)
        label.textContent = ov
          ? familyDisplay(key, ov) + (pageOverride(sc, key) !== undefined ? " (page)" : " (all pages)")
          : "Site default";
    } else if (label) label.textContent = ov ? effectiveLabel(sc, key) : (def ?? "");
    const reset = row.querySelector(".token-reset");
    if (reset) reset.disabled = !hasOwnOverride(sc, key);
    const active = document.activeElement;
    const skip = (el) => el && active === el;
    if (kind === "color") {
      const swatch = row.querySelector(".color-swatch");
      const hex = row.querySelector(".color-hex");
      const cur = ov && HEX_RE.test(ov) ? ov : def && HEX_RE.test(def) ? def : null;
      if (swatch && !skip(swatch) && cur) swatch.value = cur;
      if (hex && !skip(hex)) {
        hex.value = ov ?? (def && HEX_RE.test(def) ? def : "");
        hex.classList.remove("invalid");
      }
    } else if (kind === "size") {
      const slider = row.querySelector(".range");
      const num = row.querySelector(".num");
      const parsed = parseSize(ov ?? def ?? "0px");
      const n = parsed ? parsed.n : 0;
      if (num && !skip(num)) num.value = n;
      if (slider && !skip(slider) && parsed) {
        slider.value = Math.min(Math.max(n, +slider.min), +slider.max);
      }
    } else if (kind === "stack" || kind === "number") {
      const input = row.querySelector(".stack-input, .num");
      if (input && !skip(input)) input.value = ov ?? def ?? "";
    } else if (kind === "text") {
      const input = row.querySelector(".stack-input");
      if (input && !skip(input)) input.value = ov ?? "";
    } else if (kind === "family") {
      const select = row.querySelector(".font-select");
      if (select && !skip(select)) {
        const cur = ov || "";
        if (cur && ![...select.options].some((o) => o.value === cur))
          select.appendChild(new Option("Custom stack…", cur, false, true));
        select.value = cur;
      }
    } else if (kind === "shadow") {
      const sh = ov || { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", alpha: 0.1 };
      row.querySelectorAll("input[type=number]").forEach((num, i) => {
        const f = ["x", "y", "blur", "spread", "alpha"][i];
        if (num && !skip(num)) num.value = sh[f];
      });
      const swatch = row.querySelector(".color-swatch");
      if (swatch && !skip(swatch)) swatch.value = sh.color || "#000000";
    }
  }

  function resetToken(sc, key, route) {
    const target = scopeStore(sc, route);
    delete target[key];
    saveStore();
    pushToFrame("setOne", { group: sc, name: key, value: "", route: route && route !== "universal" ? route : null });
    syncRow(sc, key);
    updateNavCounts();
  }

  function editedCountForGroup(g) {
    if (g.id === "shadows") return Object.keys(rawGroup("shadows")).length;
    if (g.id === "texts") return Object.keys(rawGroup("texts")).length;
    if (g.id === "assets") return Object.keys(rawGroup("assets")).length;
    if (g.id === "scoped") return Object.keys(rawGroup("scoped")).length;
    if (g.id === "buttons")
      return g
        .keys()
        .filter(([k, sc]) => {
          const s = sc === "theme" ? theme : "global";
          return rawGroup(s)[k] !== undefined;
        }).length;
    const sc = scopeOf(g);
    return Object.keys(rawGroup(sc)).filter((k) => {
      if (g.id === "semantic") return k in defaults.dark || k in defaults.light;
      return true;
    }).length;
  }

  function updateNavCounts() {
    for (const b of els.groupNav.querySelectorAll("button")) {
      const g = GROUPS.find((x) => x.id === b.dataset.id);
      const span = b.querySelector(".count");
      if (g && span) span.textContent = editedCountForGroup(g);
    }
  }

  const PICK_CSS = [
    ".dse-picking,.dse-picking *{cursor:crosshair!important}",
    ".dse-pick-hover{outline:2px solid #22d3ee!important;outline-offset:-1px!important}",
    ".dse-tok-hl{outline:2px dashed #22d3ee!important;outline-offset:-1px!important}",
    ".dse-tok-hl-pulse{animation:dse-hl-pulse 1.1s ease 3;box-shadow:0 0 0 4px rgba(34,211,238,.45)!important}",
    "@keyframes dse-hl-pulse{0%,100%{outline-color:#22d3ee}50%{outline-color:#ff00ff;outline-width:4px}}",
    ".dse-pick-selected,.dse-pick-target{outline:3px solid #fbbf24!important;outline-offset:0!important;box-shadow:0 0 0 5px rgba(251,191,36,.28)!important}",
  ].join("");

  const pick = { on: false, cleanup: null, hovered: null, selected: null };
  let pickApplyScope = "element";
  const ruleCache = new WeakMap();

  function isKnownToken(t) {
    return (
      defaults &&
      !/^(--tw-|--rk-|--font-inter)/.test(t) &&
      (t in defaults.palette || t in defaults.global || t in defaults.dark || t in defaults.light)
    );
  }

  function getRules(doc) {
    let rules = ruleCache.get(doc);
    if (rules) return rules;
    rules = [];
    const walk = (list) => {
      for (const r of list) {
        if (r.cssRules) walk(r.cssRules);
        if (r.selectorText && r.style) rules.push(r);
      }
    };
    for (const sheet of doc.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {}
    }
    ruleCache.set(doc, rules);
    return rules;
  }

  function tokensForElement(el) {
    const doc = iframe.contentDocument;
    const found = new Map();
    const add = (tok, prop) => {
      if (!isKnownToken(tok)) return;
      if (!found.has(tok)) found.set(tok, new Set());
      found.get(tok).add(prop);
    };
    for (const r of getRules(doc)) {
      let m = false;
      try {
        m = el.matches(r.selectorText);
      } catch {
        continue;
      }
      if (!m) continue;
      for (let i = 0; i < r.style.length; i++) {
        const prop = r.style[i];
        const val = r.style.getPropertyValue(prop);
        for (const mm of val.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) add(mm[1], prop);
      }
    }
    const styleAttr = el.getAttribute("style") || "";
    for (const mm of styleAttr.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) add(mm[1], "(inline)");
    return found;
  }

  function groupForToken(tok) {
    if (tok in defaults.dark || tok in defaults.light) return { group: "semantic", scopeFn: () => theme };
    if (["--primary", "--primary-foreground", "--button-primary", "--ring"].includes(tok))
      return { group: "buttons", scope: "global" };
    if (/^(--text-|--leading-|--font-)/.test(tok)) return { group: "typography", scope: "global" };
    if (/^(--spacing$|--space-|--page-gutter|--container-)/.test(tok)) return { group: "spacing", scope: "global" };
    if (/^--radius/.test(tok)) return { group: "radius", scope: "global" };
    if (tok in defaults.palette) return { group: "palette", scope: "palette" };
    return null;
  }

  function describeElement(el) {
    const classes = (el.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
    const text = (el.textContent || "").trim().slice(0, 40);
    return el.tagName.toLowerCase() + (classes ? "." + classes : "") + (text ? ` "${text}"` : "");
  }

  function uniqueSelectorFor(el) {
    const doc = iframe.contentDocument;
    if (!el || el === doc.body) return "body";
    const segFor = (node) => {
      const tid = node.getAttribute && node.getAttribute("data-testid");
      if (tid) return node.tagName.toLowerCase() + `[data-testid="${String(tid).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`;
      const slot = node.getAttribute && node.getAttribute("data-slot");
      if (slot) {
        let seg = node.tagName.toLowerCase() + `[data-slot="${String(slot).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`;
        const parent = node.parentElement;
        if (parent) {
          const sibs = [...parent.children].filter(
            (c) => c.tagName === node.tagName && c.getAttribute("data-slot") === slot
          );
          if (sibs.length > 1) seg += `:nth-of-type(${sibs.indexOf(node) + 1})`;
        }
        return seg;
      }
      let seg = node.tagName.toLowerCase();
      const parent = node.parentElement;
      if (parent) {
        const sibs = [...parent.children].filter((c) => c.tagName === node.tagName);
        if (sibs.length > 1) seg += `:nth-of-type(${sibs.indexOf(node) + 1})`;
      }
      return seg;
    };
    const parts = [];
    let node = el;
    let hops = 0;
    while (node && node !== doc.body && hops < 14) {
      hops++;
      parts.unshift(segFor(node));
      node = node.parentElement;
    }
    if (node === doc.body) parts.unshift("body");
    for (let i = parts.length - 1; i >= 0; i--) {
      const sel = parts.slice(i).join(" > ");
      try {
        if (doc.querySelectorAll(sel).length === 1 && el.matches(sel)) return sel;
      } catch {}
    }
    return parts.join(" > ");
  }

  function currentPropValue(el, prop) {
    try {
      const v = iframe.contentWindow.getComputedStyle(el).getPropertyValue(prop).trim();
      if (v) return v;
    } catch {}
    return "";
  }

  const SCOPED_COLOUR_PROPS = new Set([
    "color",
    "background",
    "background-color",
    "fill",
    "stroke",
    "border-color",
    "outline-color",
    "text-decoration-color",
  ]);

  function componentSelectorFor(el) {
    const body = iframe.contentDocument && iframe.contentDocument.body;
    let node = el;
    let hops = 0;
    while (node && node !== body && hops < 8) {
      if (node.hasAttribute && (node.hasAttribute("data-testid") || node.hasAttribute("data-slot")))
        return uniqueSelectorFor(node);
      node = node.parentElement;
      hops++;
    }
    return uniqueSelectorFor(el);
  }

  function tokenGroupFor(token, kind) {
    if (token in defaults.palette) return "palette";
    if (token in defaults.dark || token in defaults.light) return theme;
    return "global";
  }

  function addScopedOverride(el, it) {
    const prop = (it.props || []).find((p) => !/^\(/.test(p)) || "";
    if (!prop) {
      showToast("Can't scope this token — no CSS property found");
      return;
    }
    let val = currentPropValue(el, prop);
    if (!val) {
      showToast("No computed value for this property");
      return;
    }
    const looksColour = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color-mix\()/i.test(val);
    const kind = SCOPED_COLOUR_PROPS.has(prop) || looksColour ? "color" : "value";
    if (kind === "color") {
      const hex = rgbToHex(val);
      if (hex) val = hex;
    }
    if (pickApplyScope === "everywhere" && it.token && it.group !== "shadows") {
      setToken(tokenGroupFor(it.token), it.token, val);
      showToast("Token updated everywhere");
      renderCenter();
      return;
    }
    let sel = uniqueSelectorFor(el);
    let route = null;
    if (pickApplyScope === "component") sel = componentSelectorFor(el);
    else if (pickApplyScope === "page") route = getPreviewPath() || "/";
    const id = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const entry = {
      sel,
      prop,
      token: it.token || "",
      value: val,
      kind,
    };
    setScoped(id, entry, route);
    showToast(
      pickApplyScope === "component"
        ? "Applied to this component"
        : pickApplyScope === "page"
          ? "Applied on this page"
          : "Override added for this element only"
    );
    if (section === "advanced") {
      group = "scoped";
      renderCenter();
      scrollToRow("scoped", id);
    } else {
      renderCenter();
    }
  }

  function setScoped(id, entry, route) {
    const target = scopeStore("scoped", route);
    if (!entry || !entry.value || !entry.sel || !entry.prop) delete target[id];
    else target[id] = entry;
    saveStore();
    pushToFrame("setOne", {
      group: "scoped",
      name: id,
      value: entry || null,
      route: route && route !== "universal" ? route : null,
    });
    dirty = true;
    updateThemeBadge();
  }


  /* ===================== Simple click-to-edit layer ===================== */

  const SIMPLE_TEXT_TAGS = new Set([
    "P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "A", "LI", "LABEL", "STRONG", "EM",
    "SMALL", "BLOCKQUOTE", "TD", "TH", "FIGCAPTION", "TIME", "BUTTON",
  ]);

  function simpleHasDirectText(el) {
    return [...el.childNodes].some((n) => n.nodeType === 3 && String(n.nodeValue || "").trim());
  }

  function simpleIsTextish(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.tagName === "BUTTON") return false;
    if (el.matches('section,main,header,footer,nav,[role=region],[data-slot="card"],.bg-card,[class*="card-nest"]'))
      return false;
    if (SIMPLE_TEXT_TAGS.has(el.tagName)) return true;
    const text = String(el.textContent || "").trim();
    if (!text || text.length > 120) return false;
    if (el.querySelector("img,svg,video,canvas,input,textarea,select,button")) return false;
    return simpleHasDirectText(el) || el.childElementCount === 0;
  }

  function resolveSimpleTarget(el) {
    if (!el) return el;
    if (el.nodeType === 3) el = el.parentElement;
    if (!el || el.nodeType !== 1) return el;
    const svg = el.closest("svg");
    if (svg) return svg;
    if (el.tagName === "IMG") return el;
    const input = el.closest("input,textarea,select");
    if (input) return input;
    const button = el.closest('button,[data-slot="button"],[role="button"]');
    if (button) return button;
    if (simpleIsTextish(el)) return el;
    const card = el.closest('[data-slot="card"],.bg-card,[class*="card-nest"],[class*="card"]');
    if (card) return card;
    const section = el.closest("section,main,header,footer,nav,[role=region]");
    if (section) return section;
    return el;
  }

  function simpleKindOf(el) {
    if (!el) return "other";
    if (el.tagName === "IMG") return "image";
    if (el.tagName && el.tagName.toLowerCase() === "svg") return "icon";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.closest("input,textarea,select")) return "input";
    if (el.tagName === "BUTTON" || el.closest('button,[data-slot="button"],[role="button"]')) return "button";
    if (el.closest('[data-slot="card"],.bg-card,[class*="card-nest"]') || /(^|[-_])card($|[-_])/.test(String(el.className || "")))
      return "card";
    if (el.matches("section,main,header,footer,nav,body,[role=region]")) return "section";
    if (simpleIsTextish(el)) return "text";
    return "other";
  }

  function simpleKindLabel(kind) {
    return {
      button: "BUTTON",
      text: "TEXT",
      image: "IMAGE",
      icon: "ICON",
      card: "CARD",
      section: "BACKGROUND",
      input: "INPUT",
      other: "ELEMENT",
    }[kind] || "ELEMENT";
  }

  function simpleNameOf(el, kind) {
    const label = findLabelMatch(el);
    if (label && label.length <= 44) return label;
    if (el.getAttribute && el.getAttribute("aria-label")) return el.getAttribute("aria-label");
    if (el.getAttribute && el.getAttribute("alt")) return el.getAttribute("alt");
    if (kind === "image") return "Image";
    if (kind === "icon") {
      const cls = String(el.getAttribute("class") || "");
      const m = /lucide-([a-z0-9-]+)/.exec(cls);
      return m ? m[1].replace(/-/g, " ") : "Icon";
    }
    if (kind === "card") return "Card";
    if (kind === "section") return "Background";
    if (kind === "input") return "Input";
    if (kind === "button") return "Button";
    if (kind === "text") return "Text";
    return "Element";
  }

  function hideSimplePanels() {
    if (els.brandPanel) els.brandPanel.hidden = true;
    if (els.exportPanel) els.exportPanel.hidden = true;
    if (els.themePanel) els.themePanel.hidden = true;
    if (els.simpleInspector) els.simpleInspector.hidden = true;
    if (els.conceptMenu) els.conceptMenu.hidden = true;
    if (els.btnBrandMain) els.btnBrandMain.classList.remove("active");
  }

  function clearSimpleOutline() {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      for (const el of doc.querySelectorAll(".dse-pick-selected")) el.classList.remove("dse-pick-selected");
    } catch {}
  }

  function closeSimpleInspector() {
    if (els.simpleInspector) els.simpleInspector.hidden = true;
    clearSimpleOutline();
    simpleSelection = null;
  }

  function openSimpleInspector(el) {
    if (!el) return;
    closeThemePanel();
    const kind = simpleKindOf(el);
    simpleSelection = {
      el,
      kind,
      name: simpleNameOf(el, kind),
      ops: [],
      similarIds: [],
      similarAssetIds: [],
      assetId: null,
    };
    hideSimplePanels();
    renderSimpleInspector();
    if (els.simpleInspector) els.simpleInspector.hidden = false;
  }

  function simpleComputedColor(el, prop, fallback) {
    const v = currentPropValue(el, prop || "background-color");
    return rgbToHex(v) || fallback || "#ffffff";
  }

  function simpleComputedPx(el, prop, fallback) {
    const n = parseFloat(currentPropValue(el, prop) || "");
    return Number.isFinite(n) ? n : fallback || 0;
  }

  function simpleRadiusPct(el, max) {
    const r = simpleComputedPx(el, "border-top-left-radius", 0);
    return r >= 999 ? 100 : Math.max(0, Math.min(100, Math.round((r / (max || 32)) * 100)));
  }

  function simpleRadiusValue(pct, pill) {
    if (pct >= 100 && pill) return "9999px";
    return `${Math.round(((pct || 0) / 100) * (pill ? 32 : 32))}px`;
  }

  function simpleBucket(value, buckets, fallback) {
    let best = fallback;
    let dist = Infinity;
    for (const b of buckets) {
      const d = Math.abs(b.value - value);
      if (d < dist) {
        dist = d;
        best = b.id;
      }
    }
    return best;
  }

  function simpleLabel(text, value) {
    const el = document.createElement("div");
    el.className = "si-label";
    const strong = document.createElement("strong");
    strong.textContent = text;
    el.appendChild(strong);
    if (value) {
      const span = document.createElement("span");
      span.textContent = value;
      el.appendChild(span);
    }
    return el;
  }

  function simpleRow(label, control, value) {
    const row = document.createElement("div");
    row.className = "si-row";
    row.appendChild(simpleLabel(label, value));
    const body = document.createElement("div");
    body.className = "si-control";
    if (Array.isArray(control)) control.forEach((c) => body.appendChild(c));
    else body.appendChild(control);
    row.appendChild(body);
    return row;
  }

  function simpleColorControl(label, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "si-control";
    const swatch = document.createElement("input");
    swatch.type = "color";
    swatch.className = "si-color";
    swatch.value = HEX_RE.test(String(value || "")) ? value : "#ffffff";
    const hex = document.createElement("input");
    hex.type = "text";
    hex.className = "si-color-val";
    hex.value = swatch.value;
    const commit = (v) => {
      if (!HEX_RE.test(String(v || "").trim())) return;
      const val = String(v).trim().toLowerCase();
      swatch.value = val;
      hex.value = val;
      onChange(val);
    };
    swatch.oninput = () => commit(swatch.value);
    hex.onchange = () => commit(hex.value);
    hex.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit(hex.value);
      }
    };
    wrap.append(swatch, hex);
    return simpleRow(label, wrap);
  }

  function simpleSegmentControl(label, options, active, onChange) {
    const seg = document.createElement("div");
    seg.className = "si-seg";
    for (const opt of options) {
      const b = document.createElement("button");
      b.textContent = opt.label;
      b.dataset.value = opt.value;
      if (opt.value === active) b.classList.add("active");
      b.onclick = () => {
        for (const x of seg.querySelectorAll("button")) x.classList.toggle("active", x === b);
        onChange(opt.value);
      };
      seg.appendChild(b);
    }
    return simpleRow(label, seg);
  }

  function simpleRangeControl(label, value, onChange, ends) {
    const wrap = document.createElement("div");
    wrap.className = "si-range-wrap";
    const range = document.createElement("input");
    range.type = "range";
    range.className = "si-range";
    range.min = "0";
    range.max = "100";
    range.step = "1";
    range.value = String(Math.max(0, Math.min(100, value)));
    range.oninput = () => onChange(Number(range.value));
    wrap.appendChild(range);
    const row = simpleRow(label, wrap);
    if (ends) {
      const hint = document.createElement("div");
      hint.className = "si-range-ends";
      hint.innerHTML = `<span>${ends[0]}</span><span>${ends[1]}</span>`;
      row.appendChild(hint);
    }
    return row;
  }

  function simpleTextControl(label, value, onCommit, multiline) {
    const input = document.createElement(multiline ? "textarea" : "input");
    if (!multiline) input.type = "text";
    input.className = "si-text";
    input.value = value || "";
    if (multiline) input.rows = 3;
    const commit = () => {
      const v = input.value.trim();
      if (v) onCommit(v);
    };
    input.onchange = commit;
    input.onkeydown = (e) => {
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        commit();
      }
    };
    return simpleRow(label, input);
  }

  function simpleSelectControl(label, options, value, onChange) {
    const select = document.createElement("select");
    select.className = "si-select";
    for (const opt of options) select.appendChild(new Option(opt.label, opt.value));
    select.value = value || "";
    select.onchange = () => onChange(select.value || null);
    return simpleRow(label, select);
  }

  function simpleFontOptions() {
    const out = [{ label: "Default", value: "" }];
    for (const [label, value] of familySystemOptions("--font-sans")) out.push({ label, value });
    for (const [family] of fontsByFamily()) out.push({ label: family, value: family });
    return out;
  }

  function simpleFontValue(el) {
    const family = String(currentPropValue(el, "font-family") || "").replace(/["']/g, "").split(",")[0].trim();
    const match = simpleFontOptions().find((o) => o.value && o.value.toLowerCase() === family.toLowerCase());
    return match ? family : "";
  }

  function simpleApply(prop, value, kind, from) {
    if (!simpleSelection || !value) return;
    const existing = simpleSelection.ops.find((o) => o.prop === prop);
    const id = existing ? existing.id : "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const entry = {
      sel: uniqueSelectorFor(simpleSelection.el),
      prop,
      value: String(value),
      kind: kind || "value",
      from: from || (existing && existing.from) || "",
      label: simpleSelection.name,
    };
    setScoped(id, entry, null);
    if (existing) {
      existing.value = String(value);
      existing.kind = entry.kind;
    } else {
      simpleSelection.ops.push({ id, prop, value: String(value), kind: entry.kind, from: entry.from, label: entry.label });
    }
    markSimpleChanged();
  }

  function markSimpleChanged() {
    if (!simpleSelection) return;
    const wrap = els.siSimilarWrap;
    if (wrap) {
      wrap.hidden = simpleSelection.ops.length === 0;
      const b = els.siSimilar;
      if (b) {
        const word = {
          button: "buttons",
          text: "text",
          image: "images",
          icon: "icons",
          card: "cards",
          section: "sections",
          input: "inputs",
          other: "elements",
        }[simpleSelection.kind] || "elements";
        b.textContent = `Apply to all similar ${word}`;
      }
    }
  }

  function simpleRemoveOps() {
    if (!simpleSelection) return;
    for (const op of simpleSelection.ops) setScoped(op.id, null, null);
    for (const id of simpleSelection.similarIds) setScoped(id, null, null);
    for (const id of simpleSelection.similarAssetIds) setAsset(id, null, null);
    if (simpleSelection.assetId) setAsset(simpleSelection.assetId, null, null);
    simpleSelection.ops = [];
    simpleSelection.similarIds = [];
    simpleSelection.similarAssetIds = [];
    simpleSelection.assetId = null;
    if (els.siSimilarWrap) els.siSimilarWrap.hidden = true;
    renderSimpleInspector();
    showToast("Reset");
  }

  function simpleSimilarSelector(kind) {
    if (!simpleSelection) return null;
    const el = simpleSelection.el;
    if (kind === "button") return el.getAttribute("data-slot") === "button" ? '[data-slot="button"]' : "button";
    if (kind === "card") return '[data-slot="card"], .bg-card';
    if (kind === "icon") return "svg";
    if (kind === "image") return "img";
    if (kind === "input") return "input, textarea, select";
    if (kind === "section") return el.tagName.toLowerCase();
    if (kind === "text") return el.tagName.toLowerCase();
    return uniqueSelectorFor(el);
  }

  function applySimpleToSimilar() {
    if (!simpleSelection) return;
    const sel = simpleSimilarSelector(simpleSelection.kind);
    if (!sel) return;
    for (const op of simpleSelection.ops) {
      const id = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      setScoped(
        id,
        {
          sel,
          prop: op.prop,
          value: op.value,
          kind: op.kind,
          from: op.from || "",
          label: op.label,
        },
        null
      );
      simpleSelection.similarIds.push(id);
    }
    if (simpleSelection.assetId && simpleSelection.kind === "icon") {
      const asset = (store.assets || {})[simpleSelection.assetId];
      if (asset) {
        const id = "ma" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        setAsset(id, { ...asset, sel }, null);
        simpleSelection.similarAssetIds.push(id);
      }
    }
    if (els.siSimilarWrap) els.siSimilarWrap.hidden = true;
    showToast("Applied to similar elements");
  }

  function renderSimpleInspector() {
    if (!simpleSelection || !els.siBody) return;
    const { el, kind } = simpleSelection;
    if (els.siKind) els.siKind.textContent = simpleKindLabel(kind);
    if (els.siName) els.siName.textContent = simpleSelection.name;
    els.siBody.textContent = "";
    markSimpleChanged();

    if (kind === "button") {
      const label = findLabelMatch(el);
      if (label) els.siBody.appendChild(simpleTextControl("Text", label, (v) => simpleApply("_text", v, "text", label)));
      const bg = simpleComputedColor(el, "background-color", "#6b21ff");
      els.siBody.appendChild(simpleColorControl("Background", bg, (v) => simpleApply("background-color", v, "color")));
      const fg = simpleComputedColor(el, "color", "#ffffff");
      els.siBody.appendChild(simpleColorControl("Text colour", fg, (v) => simpleApply("color", v, "color")));
      const height = simpleComputedPx(el, "height", 32);
      const size = height <= 30 ? "small" : height >= 40 ? "large" : "medium";
      const sizes = {
        small: { h: "28px", p: "11px", f: "12px" },
        medium: { h: "32px", p: "14px", f: "13px" },
        large: { h: "40px", p: "18px", f: "15px" },
      };
      els.siBody.appendChild(
        simpleSegmentControl(
          "Size",
          [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
          size,
          (v) => {
            const s = sizes[v];
            simpleApply("height", s.h);
            simpleApply("padding-inline", s.p);
            simpleApply("font-size", s.f);
          }
        )
      );
      els.siBody.appendChild(
        simpleRangeControl("Corners", simpleRadiusPct(el, 32), (v) => simpleApply("border-radius", simpleRadiusValue(v, true)), ["Square", "Rounded"])
      );
    } else if (kind === "text") {
      const label = findLabelMatch(el) || String(el.textContent || "").trim();
      if (label) els.siBody.appendChild(simpleTextControl("Text", label, (v) => simpleApply("_text", v, "text", label), label.length > 60));
      const color = simpleComputedColor(el, "color", "#161226");
      els.siBody.appendChild(simpleColorControl("Colour", color, (v) => simpleApply("color", v, "color")));
      const font = simpleFontValue(el);
      els.siBody.appendChild(
        simpleSelectControl("Font", simpleFontOptions(), font, (v) => {
          if (!v) return;
          const stack = /^ui-|^Georgia|^system/i.test(v) ? v : `"${v}", var(--font-sans)`;
          simpleApply("font-family", stack);
        })
      );
      const size = Math.round(simpleComputedPx(el, "font-size", 16));
      els.siBody.appendChild(simpleRangeControl("Size", Math.max(0, Math.min(100, ((size - 10) / 38) * 100)), (v) => simpleApply("font-size", `${Math.round(10 + (v / 100) * 38)}px`), ["Small", "Large"]));
      const weight = parseInt(currentPropValue(el, "font-weight") || "400", 10) || 400;
      const w = weight >= 600 ? "bold" : weight >= 500 ? "medium" : "regular";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Weight",
          [
            { label: "Regular", value: "regular" },
            { label: "Medium", value: "medium" },
            { label: "Bold", value: "bold" },
          ],
          w,
          (v) => simpleApply("font-weight", v === "bold" ? "700" : v === "medium" ? "500" : "400")
        )
      );
    } else if (kind === "image") {
      const preview = document.createElement("img");
      preview.className = "si-img-preview";
      preview.alt = "";
      preview.src = el.getAttribute("src") || "";
      const previewRow = document.createElement("div");
      previewRow.className = "si-row";
      previewRow.appendChild(preview);
      els.siBody.appendChild(previewRow);
      const upload = document.createElement("button");
      upload.className = "si-file-btn";
      upload.textContent = "Replace image";
      upload.onclick = () =>
        openAssetPicker({
          sel: uniqueSelectorFor(el),
          kind: "img",
          route: null,
          simple: true,
          replaceId: simpleSelection.assetId || "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        });
      const uploadRow = document.createElement("div");
      uploadRow.className = "si-row";
      uploadRow.appendChild(upload);
      els.siBody.appendChild(uploadRow);
      const fit = currentPropValue(el, "object-fit") === "cover" ? "fill" : "fit";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Fit",
          [
            { label: "Fit", value: "fit" },
            { label: "Fill", value: "fill" },
          ],
          fit,
          (v) => simpleApply("object-fit", v === "fill" ? "cover" : "contain")
        )
      );
      const pos = /bottom/.test(currentPropValue(el, "object-position")) ? "bottom" : /top/.test(currentPropValue(el, "object-position")) ? "top" : "center";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Position",
          [
            { label: "Top", value: "top" },
            { label: "Centre", value: "center" },
            { label: "Bottom", value: "bottom" },
          ],
          pos,
          (v) => simpleApply("object-position", `center ${v}`)
        )
      );
    } else if (kind === "icon") {
      const color = simpleComputedColor(el, "color", "#161226");
      els.siBody.appendChild(simpleColorControl("Colour", color, (v) => simpleApply("color", v, "color")));
      const w = simpleComputedPx(el, "width", 20);
      const size = w <= 17 ? "small" : w >= 22 ? "large" : "medium";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Size",
          [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
          size,
          (v) => {
            const px = v === "small" ? "16px" : v === "large" ? "26px" : "20px";
            simpleApply("width", px);
            simpleApply("height", px);
          }
        )
      );
      const upload = document.createElement("button");
      upload.className = "si-file-btn";
      upload.textContent = "Replace icon";
      upload.onclick = () =>
        openAssetPicker({
          sel: uniqueSelectorFor(el),
          kind: "icon",
          route: null,
          simple: true,
          replaceId: simpleSelection.assetId || "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          cls: el.getAttribute("class") || "",
          width: el.getAttribute("width") || "",
          height: el.getAttribute("height") || "",
        });
      const row = document.createElement("div");
      row.className = "si-row";
      row.appendChild(upload);
      els.siBody.appendChild(row);
    } else if (kind === "card") {
      const bg = simpleComputedColor(el, "background-color", tokenHex("--bg-container", theme) || "#ffffff");
      els.siBody.appendChild(simpleColorControl("Background", bg, (v) => simpleApply("background-color", v, "color")));
      const border = simpleComputedColor(el, "border-top-color", "#000000");
      els.siBody.appendChild(simpleColorControl("Border", border, (v) => simpleApply("border", `1px solid ${v}`)));
      const none = document.createElement("button");
      none.className = "ghost";
      none.textContent = "No border";
      none.onclick = () => simpleApply("border", "none");
      const row = document.createElement("div");
      row.className = "si-row";
      row.appendChild(none);
      els.siBody.appendChild(row);
      els.siBody.appendChild(
        simpleRangeControl("Corners", simpleRadiusPct(el, 32), (v) => simpleApply("border-radius", simpleRadiusValue(v)), ["Square", "Rounded"])
      );
      const shadow = currentPropValue(el, "box-shadow");
      const shadowNums = [...String(shadow || "").matchAll(/(-?[\d.]+)px/g)].map((m) => parseFloat(m[1]));
      const shadowBucket = !shadow || shadow === "none" ? "none" : (shadowNums[2] || 0) >= 18 ? "strong" : "soft";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Shadow",
          [
            { label: "None", value: "none" },
            { label: "Soft", value: "soft" },
            { label: "Strong", value: "strong" },
          ],
          shadowBucket,
          (v) => simpleApply("box-shadow", v === "none" ? "none" : shadowValue(v === "strong" ? "lg" : "md"))
        )
      );
      const pad = simpleComputedPx(el, "padding-top", 16);
      const spacing = pad <= 14 ? "compact" : pad >= 20 ? "spacious" : "normal";
      els.siBody.appendChild(
        simpleSegmentControl(
          "Spacing",
          [
            { label: "Compact", value: "compact" },
            { label: "Normal", value: "normal" },
            { label: "Spacious", value: "spacious" },
          ],
          spacing,
          (v) => simpleApply("padding", v === "compact" ? "12px" : v === "spacious" ? "24px" : "16px")
        )
      );
    } else if (kind === "section") {
      const bg = simpleComputedColor(el, "background-color", tokenHex("--bg-screen", theme) || "#0d0b1a");
      els.siBody.appendChild(simpleColorControl("Colour", bg, (v) => simpleApply("background-color", v, "color")));
      const bgImage = currentPropValue(el, "background-image");
      const replace = document.createElement("button");
      replace.className = "si-file-btn";
      replace.textContent = "Replace background image";
      replace.onclick = () =>
        openAssetPicker({
          sel: uniqueSelectorFor(el),
          kind: "bg",
          route: null,
          simple: true,
          replaceId: simpleSelection.assetId || "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        });
      const row = document.createElement("div");
      row.className = "si-row";
      row.appendChild(replace);
      els.siBody.appendChild(row);
      if (bgImage && bgImage !== "none") {
        const clear = document.createElement("button");
        clear.className = "ghost";
        clear.textContent = "No background image";
        clear.onclick = () => {
          simpleApply("background-image", "none");
          if (simpleSelection && simpleSelection.assetId) {
            setAsset(simpleSelection.assetId, null, null);
            simpleSelection.assetId = null;
          }
        };
        const cr = document.createElement("div");
        cr.className = "si-row";
        cr.appendChild(clear);
        els.siBody.appendChild(cr);
      }
      els.siBody.appendChild(
        simpleRangeControl("Corners", simpleRadiusPct(el, 32), (v) => simpleApply("border-radius", simpleRadiusValue(v)), ["Square", "Rounded"])
      );
    } else if (kind === "input") {
      const bg = simpleComputedColor(el, "background-color", tokenHex("--bg-input", theme) || "#ffffff");
      els.siBody.appendChild(simpleColorControl("Background", bg, (v) => simpleApply("background-color", v, "color")));
      const fg = simpleComputedColor(el, "color", tokenHex("--text-primary", theme) || "#161226");
      els.siBody.appendChild(simpleColorControl("Text colour", fg, (v) => simpleApply("color", v, "color")));
      const border = simpleComputedColor(el, "border-top-color", "#888888");
      els.siBody.appendChild(simpleColorControl("Border", border, (v) => simpleApply("border", `1px solid ${v}`)));
      els.siBody.appendChild(
        simpleRangeControl("Corners", simpleRadiusPct(el, 24), (v) => simpleApply("border-radius", simpleRadiusValue(v)), ["Square", "Rounded"])
      );
    } else {
      const bg = simpleComputedColor(el, "background-color", "transparent");
      els.siBody.appendChild(simpleColorControl("Background", bg, (v) => simpleApply("background-color", v, "color")));
      const border = simpleComputedColor(el, "border-top-color", "#888888");
      els.siBody.appendChild(simpleColorControl("Border", border, (v) => simpleApply("border", `1px solid ${v}`)));
      els.siBody.appendChild(
        simpleRangeControl("Corners", simpleRadiusPct(el, 24), (v) => simpleApply("border-radius", simpleRadiusValue(v)), ["Square", "Rounded"])
      );
    }
  }

  const MAX_ASSET_CHARS = 900000;

  function setAsset(id, entry, route) {
    const target = scopeStore("assets", route);
    if (!entry || !entry.sel || !entry.data) delete target[id];
    else target[id] = entry;
    saveStore();
    pushToFrame("setOne", {
      group: "assets",
      name: id,
      value: entry || null,
      route: route && route !== "universal" ? route : null,
    });
    dirty = true;
    updateThemeBadge();
  }

  function assetDataUrl(entry) {
    if (!entry) return "";
    if (entry.kind === "icon") return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(entry.data || "");
    return entry.data || "";
  }

  function assetTargetsFor(el) {
    const targets = [];
    const seen = new Set();
    const addTarget = (node, kind) => {
      if (!node) return;
      if (seen.has(kind)) return;
      seen.add(kind);
      targets.push({
        el: node,
        kind,
        sel: uniqueSelectorFor(node),
        cls: node.getAttribute("class") || "",
        width: node.getAttribute("width") || "",
        height: node.getAttribute("height") || "",
      });
    };
    if (el.tagName === "IMG") addTarget(el, "img");
    else {
      const direct = el.querySelector(":scope > img") || el.querySelector(":scope > * > img");
      const candidates = direct ? [direct] : [...el.querySelectorAll("img")];
      if (candidates.length === 1) addTarget(candidates[0], "img");
    }
    if (el.tagName.toLowerCase() === "svg") addTarget(el, "icon");
    else {
      const svg = el.querySelector(":scope > svg") || el.querySelector(":scope > * > svg");
      if (svg) addTarget(svg, "icon");
    }
    let bg = "";
    try {
      bg = iframe.contentWindow.getComputedStyle(el).backgroundImage || "";
    } catch {}
    if (bg && bg !== "none" && /url\(/i.test(bg)) addTarget(el, "bg");
    return targets;
  }

  let pendingAsset = null;

  function openAssetPicker(target) {
    pendingAsset = target;
    els.assetFile.accept = target.kind === "icon" ? ".svg,image/svg+xml" : "image/*";
    els.assetFile.value = "";
    els.assetFile.click();
  }

  function addAssetControl(box, el) {
    const targets = assetTargetsFor(el);
    if (!targets.length) return;
    const section = document.createElement("div");
    section.className = "pr-assets";
    const title = document.createElement("span");
    title.className = "pr-title";
    title.textContent = "Swap:";
    section.appendChild(title);
    for (const t of targets) {
      const btn = document.createElement("button");
      btn.className = "ghost";
      btn.textContent = t.kind === "img" ? "Image…" : t.kind === "icon" ? "Icon…" : "Background…";
      btn.title = t.kind === "icon" ? "Replace this icon with an SVG file" : "Replace this image with a file";
      btn.onclick = () => openAssetPicker({ ...t, route: scope });
      section.appendChild(btn);
    }
    box.appendChild(section);
  }

  function sanitizeSvgText(text) {
    let doc;
    try {
      doc = new DOMParser().parseFromString(String(text), "image/svg+xml");
    } catch {
      return null;
    }
    if (!doc || !doc.documentElement || doc.documentElement.nodeName.toLowerCase() !== "svg") return null;
    if (doc.getElementsByTagName("parsererror").length) return null;
    for (const bad of [...doc.querySelectorAll("script,foreignObject,iframe,object,embed,link,meta,style")]) bad.remove();
    for (const node of doc.querySelectorAll("*")) {
      for (const attr of [...node.attributes]) {
        const n = attr.name.toLowerCase();
        if (n.startsWith("on")) node.removeAttribute(attr.name);
        else if (/^(xlink:)?href$/.test(n) && /^\s*(javascript:|vbscript:|data:text\/html)/i.test(attr.value))
          node.removeAttribute(attr.name);
      }
    }
    return doc;
  }

  function prepareIconMarkup(fileText, target) {
    const doc = sanitizeSvgText(fileText);
    if (!doc) return null;
    const root = doc.documentElement;
    const own = (root.getAttribute("class") || "").trim();
    const cls = [own, target.cls || ""].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    if (cls) root.setAttribute("class", cls);
    for (const a of ["width", "height"]) {
      if (target[a] && !root.getAttribute(a)) root.setAttribute(a, target[a]);
    }
    return new XMLSerializer().serializeToString(root);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  async function imageToDataURL(file) {
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      const raw = await readFileAsDataURL(file);
      if (raw.length <= MAX_ASSET_CHARS) return raw;
    }
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = url;
      });
      const MAX = 1200;
      let w = img.naturalWidth || 1;
      let h = img.naturalHeight || 1;
      const scale = Math.min(1, MAX / Math.max(w, h));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const type =
        file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const out = canvas.toDataURL(type, 0.88);
      if (out.length <= MAX_ASSET_CHARS || type === "image/jpeg") return out;
      return canvas.toDataURL("image/jpeg", 0.82);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  els.assetFile.onchange = async () => {
    const file = els.assetFile.files && els.assetFile.files[0];
    els.assetFile.value = "";
    const target = pendingAsset;
    pendingAsset = null;
    if (!file || !target) return;
    try {
      let data;
      const name = file.name || "asset";
      if (target.kind === "icon") {
        if (!/\.svg$/i.test(name) && !/svg/i.test(file.type)) {
          showToast("Icons need an .svg file");
          return;
        }
        data = prepareIconMarkup(await file.text(), target);
        if (!data) {
          showToast("Could not read that SVG");
          return;
        }
        if (data.length > 400000) {
          showToast("That SVG is too large");
          return;
        }
      } else {
        if (!/^image\//.test(file.type)) {
          showToast("Choose an image file");
          return;
        }
        data = await imageToDataURL(file);
        if (data.length > MAX_ASSET_CHARS) {
          showToast("Image too large — try a smaller file");
          return;
        }
      }
      const id = target.replaceId || "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const entry = { sel: target.sel, kind: target.kind, name, data };
      if (target.kind === "icon") {
        entry.cls = target.cls || "";
        entry.width = target.width || "";
        entry.height = target.height || "";
      }
      setAsset(id, entry, target.route);
      if (target.simple && simpleSelection) {
        simpleSelection.assetId = id;
        if (target.kind === "bg") {
          simpleApply("background-size", "cover");
          simpleApply("background-position", "center");
        }
        renderSimpleInspector();
        showToast(target.kind === "icon" ? "Icon replaced" : target.kind === "bg" ? "Background replaced" : "Image replaced");
        return;
      }
      group = "assets";
      renderCenter();
      if (section === "advanced") scrollToRow("assets", id);
      showToast(target.kind === "icon" ? "Icon swapped" : target.kind === "bg" ? "Background swapped" : "Image swapped");
    } catch {
      showToast("Could not read that file");
    }
  };

  function buildAssetRow(id, entry) {
    const buildRoute = scope;
    const row = document.createElement("div");
    row.className = "token-row asset-row";
    row.dataset.token = id;
    row.dataset.scope = "assets";
    row.dataset.kind = "assets";

    const main = document.createElement("div");
    main.className = "token-main asset-main";
    const thumb = document.createElement("img");
    thumb.className = "asset-thumb";
    thumb.alt = "";
    thumb.src = assetDataUrl(entry);
    const info = document.createElement("span");
    info.className = "asset-info";
    const name = document.createElement("span");
    name.className = "token-name asset-name";
    const kindLabel = entry.kind === "icon" ? "icon" : entry.kind === "bg" ? "background" : "image";
    name.textContent = `${entry.name || "asset"} · ${kindLabel}`;
    const sel = document.createElement("span");
    sel.className = "token-value asset-sel";
    sel.textContent = entry.sel;
    sel.title = entry.sel;
    info.append(name, sel);
    main.append(thumb, info);
    row.appendChild(main);

    const controls = document.createElement("div");
    controls.className = "token-controls";
    const findBtn = document.createElement("button");
    findBtn.className = "token-find";
    findBtn.textContent = "Find on page";
    findBtn.title = "Highlight the element this swap targets";
    findBtn.onclick = () => highlightSelector(entry.sel);
    const replaceBtn = document.createElement("button");
    replaceBtn.className = "ghost";
    replaceBtn.textContent = "Replace…";
    replaceBtn.onclick = () =>
      openAssetPicker({
        sel: entry.sel,
        kind: entry.kind,
        route: buildRoute,
        replaceId: id,
        cls: entry.cls || "",
        width: entry.width || "",
        height: entry.height || "",
      });
    const del = document.createElement("button");
    del.className = "token-del";
    del.textContent = "Remove";
    del.title = "Remove this swap";
    del.onclick = () => {
      setAsset(id, null, buildRoute);
      renderCenter();
      showToast("Asset restored");
    };
    controls.append(findBtn, replaceBtn, del);
    row.appendChild(controls);
    return row;
  }

  function scopedCountForToken(key) {
    const all = { ...(store.scoped || {}), ...((store.pages[scope] || {}).scoped || {}) };
    let n = 0;
    for (const e of Object.values(all)) if (e && (e.token === key || e.prop === key)) n++;
    return n;
  }

  function buildScopedRow(id, entry) {
    const buildRoute = scope;
    const row = document.createElement("div");
    row.className = "token-row scoped-row";
    row.dataset.token = id;
    row.dataset.scope = "scoped";
    row.dataset.kind = entry.kind === "color" ? "color" : "text";

    const main = document.createElement("div");
    main.className = "token-main";
    const name = document.createElement("span");
    name.className = "token-name";
    name.textContent = entry.token ? `${entry.prop} · ${entry.token}` : entry.prop;
    name.title = `Sets ${entry.prop} on ${entry.sel}${entry.token ? ` (from ${entry.token})` : ""}`;
    const val = document.createElement("span");
    val.className = "token-value scoped-sel";
    val.textContent = entry.sel;
    val.title = entry.sel;
    main.append(name, val);
    row.appendChild(main);

    const controls = document.createElement("div");
    controls.className = "token-controls";
    const findBtn = document.createElement("button");
    findBtn.className = "token-find";
    findBtn.textContent = "Find on page";
    findBtn.title = "Highlight the element this override targets";
    findBtn.onclick = () => highlightSelector(entry.sel);
    controls.appendChild(findBtn);

    if (entry.kind === "color") {
      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.className = "color-swatch";
      const hex = document.createElement("input");
      hex.type = "text";
      hex.className = "color-hex";
      hex.placeholder = "#hex";
      hex.setAttribute("aria-label", (entry.prop || entry.token) + " scoped hex value");
      const cur = HEX_RE.test(entry.value) ? entry.value : rgbToHex(entry.value) || "";
      if (cur) swatch.value = cur;
      hex.value = cur || entry.value;
      hex.oninput = () => {
        const v = hex.value.trim();
        hex.classList.toggle("invalid", !HEX_RE.test(v));
      };
      const commitHex = () => {
        const v = hex.value.trim();
        if (HEX_RE.test(v)) setScoped(id, { ...entry, value: v.toLowerCase() }, buildRoute);
        else if (!v) setScoped(id, null, buildRoute);
        else hex.classList.add("invalid");
      };
      hex.onchange = commitHex;
      hex.onkeydown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        commitHex();
      };
      swatch.oninput = () => {
        hex.value = swatch.value;
        hex.classList.remove("invalid");
        setScoped(id, { ...entry, value: swatch.value }, buildRoute);
      };
      controls.append(swatch, hex);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "stack-input";
      input.value = entry.value || "";
      input.placeholder = "Value";
      input.setAttribute("aria-label", (entry.prop || entry.token) + " scoped value");
      const commitVal = () => {
        const v = input.value.trim();
        if (v) setScoped(id, { ...entry, value: v }, buildRoute);
        else setScoped(id, null, buildRoute);
      };
      input.onchange = commitVal;
      input.onkeydown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        commitVal();
      };
      controls.appendChild(input);
    }

    const del = document.createElement("button");
    del.className = "token-del";
    del.textContent = "Remove";
    del.title = "Remove this scoped override";
    del.onclick = () => {
      setScoped(id, null, buildRoute);
      renderCenter();
    };
    controls.appendChild(del);
    row.appendChild(controls);
    return row;
  }

  function setPickMode(on) {
    pick.on = on;
    if (els.btnPick) els.btnPick.classList.toggle("active", on);
    if (els.pickHint) els.pickHint.hidden = !on;
    updateSelectAction();
    if (on) {
      closeThemePanel();
      hideSimplePanels();
      if (!attachPicker()) showToast("Preview not ready — try again in a moment");
    } else if (pick.cleanup) {
      pick.cleanup();
      pick.cleanup = null;
      clearHover();
    }
    if (advancedOpen && (section === "assets" || (section === "advanced" && group === "assets"))) renderCenter();
  }

  function clearHover() {
    const doc = iframe.contentDocument;
    if (!doc) return;
    for (const el of doc.querySelectorAll(".dse-pick-hover")) el.classList.remove("dse-pick-hover");
  }

  function injectPickStyles(doc) {
    if (doc.getElementById("dse-pick-css")) return;
    const s = doc.createElement("style");
    s.id = "dse-pick-css";
    s.textContent = PICK_CSS;
    doc.head.appendChild(s);
  }

  function attachPicker() {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc || !doc.body) return false;
    injectPickStyles(doc);
    doc.documentElement.classList.add("dse-picking");
    const swallow = (e) => {
      e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      e.stopPropagation();
    };
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof win.Element)) return;
      if (pick.hovered && pick.hovered !== t) pick.hovered.classList.remove("dse-pick-hover");
      pick.hovered = t;
      t.classList.add("dse-pick-hover");
    };
    const onClick = (e) => {
      swallow(e);
      const t = e.target;
      if (!(t instanceof win.Element)) return;
      pick.selected = t;
      setPickMode(false);
      selectPicked(t);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        swallow(e);
        setPickMode(false);
      }
    };
    doc.addEventListener("mouseover", onOver, true);
    doc.addEventListener("click", onClick, true);
    doc.addEventListener("mousedown", swallow, true);
    doc.addEventListener("mouseup", swallow, true);
    win.addEventListener("keydown", onKey, true);
    pick.cleanup = () => {
      doc.removeEventListener("mouseover", onOver, true);
      doc.removeEventListener("click", onClick, true);
      doc.removeEventListener("mousedown", swallow, true);
      doc.removeEventListener("mouseup", swallow, true);
      win.removeEventListener("keydown", onKey, true);
      doc.documentElement.classList.remove("dse-picking");
    };
    return true;
  }

  function selectPicked(el) {
    clearHighlights();
    clearHover();
    const doc = iframe.contentDocument;
    for (const prev of doc.querySelectorAll(".dse-pick-selected")) prev.classList.remove("dse-pick-selected");
    const target = advancedOpen ? el : resolveSimpleTarget(el);
    el = target;
    el.classList.add("dse-pick-selected");
    if (!advancedOpen) {
      openSimpleInspector(el);
      return;
    }
    const used = tokensForElement(el);
    const items = [];
    let unknown = 0;
    for (const [tok, props] of used) {
      const g = groupForToken(tok);
      if (!g) {
        unknown++;
        continue;
      }
      items.push({ token: tok, group: g.group, scope: g.scope || g.scopeFn(), props: [...props] });
    }
    const order = { semantic: 0, buttons: 1, typography: 2, spacing: 3, radius: 4, palette: 5 };
    items.sort((a, b) => (order[a.group] - order[b.group]) || a.token.localeCompare(b.token));
    const shadowClass = /\bshadow-(sm|md|lg|xl)\b/.exec(el.getAttribute("class") || "");
    if (shadowClass) items.push({ token: shadowClass[1], group: "shadows", scope: "shadows", props: ["box-shadow"] });
    renderPickResult(el, items, unknown);
    if (section === "assets" || (section === "advanced" && group === "assets")) renderCenter();
  }

  function findLabelMatch(el) {
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.nodeValue.trim())
      .find((t) => t);
    if (own) return own;
    const full = el.textContent.trim();
    if (!full || full.length > 80) return null;
    const deep = [...el.querySelectorAll("*")]
      .filter((d) => d.childElementCount === 0 && d.textContent.trim() === full)
      .pop();
    return deep ? deep.textContent.trim() : null;
  }

  function addRenameControl(box, el) {
    const match = findLabelMatch(el);
    if (!match) return;
    const section = document.createElement("div");
    section.className = "pr-rename";
    const label = document.createElement("span");
    label.className = "pr-title";
    label.textContent = "Rename:";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "stack-input";
    input.value = store.texts[match] ?? match;
    input.setAttribute("aria-label", "Rename " + match);
    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = "Save";
    btn.onclick = () => {
      const v = input.value.trim();
      if (!v) return;
      setToken("texts", match, v);
      showToast(`Renamed to "${v}"`);
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btn.click();
      }
    };
    section.append(label, input, btn);
    box.appendChild(section);
  }

  function renderPickResult(el, items, unknown) {
    const box = els.pickResult;
    box.textContent = "";
    box.hidden = false;
    const head = document.createElement("div");
    head.className = "pr-head";
    const label = document.createElement("span");
    label.className = "pr-title";
    label.textContent = "Picked:";
    const elName = document.createElement("code");
    elName.className = "pr-el";
    elName.textContent = describeElement(el);
    const repick = document.createElement("button");
    repick.className = "ghost";
    repick.textContent = "Pick again";
    repick.onclick = () => setPickMode(true);
    const clear = document.createElement("button");
    clear.className = "ghost";
    clear.textContent = "Clear";
    clear.onclick = () => {
      box.hidden = true;
      const doc = iframe.contentDocument;
      for (const s of doc.querySelectorAll(".dse-pick-selected, .dse-pick-target"))
        s.classList.remove("dse-pick-selected", "dse-pick-target");
    };
    head.append(label, elName, repick, clear);
    box.appendChild(head);
    const scopeBar = document.createElement("div");
    scopeBar.className = "insp-scope";
    const scopeLabel = document.createElement("span");
    scopeLabel.className = "insp-scope-label";
    scopeLabel.textContent = "Apply to:";
    const scopeGroup = document.createElement("div");
    scopeGroup.className = "scope-toggle";
    for (const [id, text] of [
      ["everywhere", "Everywhere"],
      ["component", "Component"],
      ["page", "This page"],
      ["element", "This element"],
    ]) {
      const b = document.createElement("button");
      b.dataset.apply = id;
      b.textContent = text;
      b.className = pickApplyScope === id ? "active" : "";
      b.onclick = () => {
        pickApplyScope = id;
        for (const x of scopeGroup.querySelectorAll("button")) x.classList.toggle("active", x.dataset.apply === id);
      };
      scopeGroup.appendChild(b);
    }
    const scopeHint = document.createElement("span");
    scopeHint.className = "insp-hint";
    scopeHint.textContent = "Applies when you choose a token below";
    scopeBar.append(scopeLabel, scopeGroup, scopeHint);
    box.appendChild(scopeBar);
    addRenameControl(box, el);
    addAssetControl(box, el);
    if (!items.length) {
      const none = document.createElement("span");
      none.className = "pick-more";
      none.textContent = "No editable tokens found on this element.";
      box.appendChild(none);
      return;
    }
    const chips = document.createElement("div");
    chips.className = "chips";
    for (const it of items) {
      const wrap = document.createElement("span");
      wrap.className = "chip-wrap";
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.dataset.token = it.token;
      chip.dataset.scope = it.scope;
      chip.title = it.props.join(", ");
      const tok = document.createElement("span");
      tok.textContent = it.group === "shadows" ? ".shadow-" + it.token : it.token;
      const grp = document.createElement("span");
      grp.className = "chip-group";
      grp.textContent = it.scope === "theme" ? theme : it.scope;
      chip.append(tok, grp);
      if (it.props.length) {
        const prop = document.createElement("span");
        prop.className = "chip-prop";
        prop.textContent = it.props[0];
        chip.appendChild(prop);
      }
      chip.onclick = () => jumpToToken(it);
      wrap.appendChild(chip);
      if (it.group !== "shadows") {
        const here = document.createElement("button");
        here.className = "chip-here";
        here.textContent = "Here";
        here.title = "Override " + it.token + " on this element only";
        here.setAttribute("aria-label", "Override " + it.token + " on this element only");
        here.onclick = () => addScopedOverride(el, it);
        wrap.appendChild(here);
      }
      chips.appendChild(wrap);
    }
    if (unknown) {
      const more = document.createElement("span");
      more.className = "pick-more";
      more.textContent = `+${unknown} internal (not editable)`;
      chips.appendChild(more);
    }
    box.appendChild(chips);
    const best = bestPickItem(items);
    if (best) {
      const bestChip = [...chips.querySelectorAll(".chip")].find((c) => c.dataset.token === best.token && c.dataset.scope === best.scope);
      if (bestChip) bestChip.classList.add("chip-active");
    }
  }

  function bestPickItem(items) {
    if (!items.length) return null;
    const GROUP_SCORE = { shadows: 100, buttons: 60, semantic: 40, typography: 30, spacing: 20, radius: 20, palette: 10 };
    const score = (it) => {
      let s = GROUP_SCORE[it.group] ?? 0;
      const prop = (it.props && it.props[0]) || "";
      if (/^background/.test(prop)) s += 8;
      else if (prop === "color") s += 6;
      else if (/^font-size|^font-family/.test(prop)) s += 5;
      else if (/^border|^box-shadow|^outline/.test(prop)) s += 4;
      if (it.scope === "theme") s += 2;
      return s;
    };
    return items.slice().sort((a, b) => score(b) - score(a))[0];
  }

  function jumpToToken(it) {
    section = "advanced";
    if (els.advancedBox) els.advancedBox.open = true;
    if (it.group === "semantic") theme = it.scope;
    group = it.group === "semantic" ? "semantic" : it.group;
    if (it.group === "shadows") group = "shadows";
    renderCenter();
    const ok = scrollToRow(it.scope, it.token);
    if (!ok) showToast("Token found but not listed in this group");
  }

  function scrollToRow(sc, key) {
    const sel = `.token-row[data-token="${CSS.escape(key)}"][data-scope="${CSS.escape(sc)}"]`;
    const row = els.tokenList.querySelector(sel);
    if (!row) return false;
    flashTarget = { sc, key };
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => {
      flashTarget = null;
    }, 2600);
    row.scrollIntoView({ block: "center", behavior: "smooth" });
    row.classList.remove("flash");
    void row.offsetWidth;
    row.classList.add("flash");
    return true;
  }

  function reapplyFlash() {
    if (!flashTarget) return;
    const sel = `.token-row[data-token="${CSS.escape(flashTarget.key)}"][data-scope="${CSS.escape(flashTarget.sc)}"]`;
    const row = els.tokenList.querySelector(sel);
    if (row && !row.classList.contains("flash")) {
      row.classList.remove("flash");
      void row.offsetWidth;
      row.classList.add("flash");
    }
  }

  if (els.btnPick) els.btnPick.addEventListener("click", () => setPickMode(!pick.on));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pick.on) setPickMode(false);
  });

  function sentinelFor(tok) {
    if (/^(--font-(sans|mono|heading))/.test(tok)) return "monospace";
    if (/^(--font-(regular|semibold|bold|black)|--font-weight)/.test(tok)) return "100";
    if (
      /^(--text-(2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)$|--leading-|--space-|--spacing$|--page-gutter|--container-|--size-|--radius)/.test(
        tok
      )
    )
      return tok === "--spacing" ? "0.123rem" : "33px";
    return "#ff00ff";
  }

  const lastHighlight = { sc: null, key: null };
  let findingActive = false;

  function isFinding(sc, key) {
    return findingActive && lastHighlight.key === key && lastHighlight.sc === sc;
  }

  function markFindingRow() {
    for (const row of els.tokenList.querySelectorAll(".token-row.finding")) row.classList.remove("finding");
    if (!findingActive) return;
    const row = els.tokenList.querySelector(
      `.token-row[data-token="${CSS.escape(lastHighlight.key)}"][data-scope="${CSS.escape(lastHighlight.sc)}"]`
    );
    if (row) row.classList.add("finding");
  }

  function findGroupForToken(key, sc) {
    if (sc === "shadows") return "shadows";
    if (sc === "texts") return "texts";
    if (sc === "palette") return "palette";
    if (sc === "dark" || sc === "light") return "semantic";
    for (const g of GROUPS) {
      if (["semantic", "palette", "shadows", "texts"].includes(g.id)) continue;
      if (g.id === "buttons") {
        if (g.keys().some(([k]) => k === key)) return "buttons";
        continue;
      }
      if (g.keys().includes(key)) return g.id;
    }
    return null;
  }

  function locateFindingRow() {
    if (!findingActive) return;
    const groupId = findGroupForToken(lastHighlight.key, lastHighlight.sc);
    if (!groupId) return;
    if (groupId === "semantic") theme = lastHighlight.sc;
    group = groupId;
    section = "advanced";
    if (els.advancedBox) els.advancedBox.open = true;
    renderCenter();
    scrollToRow(lastHighlight.sc, lastHighlight.key);
  }

  function clearHighlights() {
    const doc = iframe.contentDocument;
    if (doc) {
      for (const el of doc.querySelectorAll(".dse-tok-hl, .dse-tok-hl-pulse, .dse-pick-target"))
        el.classList.remove("dse-tok-hl", "dse-tok-hl-pulse", "dse-pick-target");
    }
    document.body.classList.remove("dse-preview-forced");
    findingActive = false;
    markFindingRow();
  }

  function propsForToken(tok) {
    if (/^(--font-(sans|mono|heading))/.test(tok)) return ["font-family"];
    if (/^(--font-(regular|semibold|bold|black)|--font-weight)/.test(tok)) return ["font-weight"];
    if (/^(--text-(2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)$|--leading-)/.test(tok))
      return ["font-size", "line-height"];
    if (/^(--space-|--spacing$|--page-gutter)/.test(tok)) return ["padding-top", "margin-top", "gap"];
    if (/^--radius/.test(tok)) return ["border-radius"];
    if (/^(--container-|--size-)/.test(tok)) return ["width", "max-width", "height", "padding-top", "gap"];
    return [
      "color",
      "background-color",
      "background-image",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "outline-color",
      "box-shadow",
      "fill",
      "stroke",
      "text-decoration-color",
    ];
  }

  async function highlightToken(sc, key) {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc || !doc.body) return;
    injectPickStyles(doc);
    clearHighlights();
    findingActive = true;
    lastHighlight.sc = sc;
    lastHighlight.key = key;
    ensurePreviewVisible();

    let candidates = [];
    if (sc === "shadows") {
      candidates = [...doc.querySelectorAll(`.shadow-${CSS.escape(key)}`)];
    } else {
      const prevTheme = doc.documentElement.getAttribute("data-theme");
      doc.documentElement.setAttribute("data-theme", sc === "dark" || sc === "light" ? sc : prevTheme || "dark");
      const all = [doc.body, ...doc.body.querySelectorAll("*")].slice(0, 3500).filter((el) => !/^dse-/.test(el.id || ""));
      const props = propsForToken(key);
      const compute = (el) => {
        const cs = win.getComputedStyle(el);
        return props.map((p) => cs[p]).join("|");
      };
      const baseline = all.map((el) => {
        try {
          return compute(el);
        } catch {
          return null;
        }
      });
      const matched = [];
      try {
        doc.documentElement.style.setProperty(key, sentinelFor(key));
        for (let i = 0; i < all.length; i++) {
          try {
            if (compute(all[i]) !== baseline[i]) matched.push(all[i]);
          } catch {}
        }
      } finally {
        doc.documentElement.style.removeProperty(key);
      }
      if (prevTheme === null) doc.documentElement.removeAttribute("data-theme");
      else doc.documentElement.setAttribute("data-theme", prevTheme);
      candidates = matched;
    }

    for (const el of candidates) el.classList.add("dse-tok-hl");
    finishHighlight(candidates, key);
  }

  function finishHighlight(candidates, label) {
    let target = null;
    let bestArea = 0;
    for (const el of candidates) {
      const rects = el.getClientRects();
      if (!rects.length) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const area = r.width * r.height;
      if (area > bestArea) {
        bestArea = area;
        target = el;
      }
    }
    if (target) {
      target.classList.add("dse-pick-target");
      target.classList.add("dse-tok-hl-pulse");
      setTimeout(() => {
        try {
          target.classList.remove("dse-tok-hl-pulse");
        } catch {}
      }, 3400);
      try {
        target.scrollIntoView({ block: "center", behavior: "smooth", inline: "nearest" });
      } catch {
        try {
          target.scrollIntoView(true);
        } catch {}
      }
    }
    renderHighlightPanel(label, candidates.length, candidates.length);
    markFindingRow();
  }

  function highlightSelector(sel) {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc || !doc.body) return;
    injectPickStyles(doc);
    clearHighlights();
    findingActive = true;
    lastHighlight.sc = null;
    lastHighlight.key = null;
    lastHighlight.roleSel = sel;
    ensurePreviewVisible();
    let candidates = [];
    try {
      candidates = [...doc.querySelectorAll(sel)];
    } catch {}
    finishHighlight(candidates, sel);
  }

  function ensurePreviewVisible() {
    const aside = document.querySelector(".preview");
    if (!aside) return;
    if (getComputedStyle(aside).display === "none") document.body.classList.add("dse-preview-forced");
    try {
      aside.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch {}
  }

  function renderHighlightPanel(key, count, total) {
    const box = els.pickResult;
    box.textContent = "";
    box.hidden = false;
    const head = document.createElement("div");
    head.className = "pr-head";
    const label = document.createElement("span");
    label.className = "pr-title";
    label.innerHTML = "";
    label.textContent = `Highlighting ${key} — `;
    const strong = document.createElement("strong");
    strong.textContent = `${count}`;
    label.appendChild(strong);
    label.appendChild(document.createTextNode(` element${count === 1 ? "" : "s"} (of ${total} candidates)`));
    const rerun = document.createElement("button");
    rerun.className = "ghost";
    rerun.textContent = "Re-run";
    rerun.onclick = () =>
      lastHighlight.roleSel ? highlightSelector(lastHighlight.roleSel) : highlightToken(lastHighlight.sc, lastHighlight.key);
    const locate = document.createElement("button");
    locate.className = "ghost";
    locate.textContent = "Locate row";
    locate.title = "Scroll the token list back to this token";
    locate.onclick = () => locateFindingRow();
    const clear = document.createElement("button");
    clear.className = "ghost";
    clear.textContent = "Clear";
    clear.onclick = () => {
      clearHighlights();
      box.hidden = true;
    };
    head.append(label, rerun, locate, clear);
    box.appendChild(head);
    if (!count) {
      const none = document.createElement("span");
      none.className = "pick-more";
      none.textContent = "No elements on this page consume the token.";
      box.appendChild(none);
    }
  }

  function pushToFrame(type, payload = {}) {
    try {
      iframe.contentWindow.__dse?.[type]?.(payload.group, payload.name, payload.value, payload.route ?? null);
    } catch {}
  }

  function followRoute(path) {
    if (!path) return;
    const norm = path.replace(/\/+$/, "") || "/";
    if (scope !== "universal") {
      scope = norm;
      renderScope();
      renderCenter();
    }
    const opt = [...els.previewPage.options].find((o) => o.value === norm);
    if (opt) els.previewPage.value = norm;
    refreshUsage();
  }

  function refreshUsage() {
    const run = async () => {
      const prev = usage;
      await computeUsage();
      const same = prev && usage && prev.size === usage.size && [...usage].every((t) => prev.has(t));
      if (!same && section === "advanced") renderGroup();
    };
    run();
    for (const ms of [700, 1600, 3000]) setTimeout(run, ms);
  }

  async function computeUsage() {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const texts = [];
      for (const sheet of doc.styleSheets) {
        try {
          texts.push([...sheet.cssRules].map((r) => r.cssText).join("\n"));
        } catch {}
      }
      for (const style of doc.querySelectorAll("style")) texts.push(style.textContent || "");
      for (const el of doc.querySelectorAll("[style]")) texts.push(el.getAttribute("style") || "");
      const re = /var\(\s*(--[a-zA-Z0-9-]+)/g;
      const used = new Set();
      for (const t of texts) {
        let m;
        while ((m = re.exec(t))) used.add(m[1]);
      }
      usage = used;
      shadowUsed = new Set(["sm", "md", "lg", "xl"].filter((n) => doc.querySelector(".shadow-" + n)));
    } catch {
      usage = null;
    }
  }

  function relevantKeys(g, keys) {
    if (!usage || g.id === "texts" || g.id === "scoped" || g.id === "assets") return keys;
    if (g.id === "shadows") return keys.filter((k) => shadowUsed.has(k));
    return keys.filter((k) => usage.has(k));
  }

  function buildUsageBar(total, shown) {
    if (!usage || shown >= total) return null;
    const bar = document.createElement("div");
    bar.className = "usage-bar";
    const label = document.createElement("span");
    label.textContent =
      shown === 0
        ? "No tokens from this group are used on this page."
        : `Showing ${shown} of ${total} tokens used on this page`;
    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = showUnused ? "Hide unused" : "Show unused";
    btn.onclick = () => {
      showUnused = !showUnused;
      renderGroup();
    };
    bar.append(label, btn);
    return bar;
  }

  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || d.__dse !== true) return;
    if (d.type === "route" && d.path) followRoute(d.path);
  });

  async function loadFonts() {
    try {
      const res = await fetch("/__dse/fonts");
      fonts = res.ok ? await res.json() : [];
    } catch {
      fonts = [];
    }
    if (!Array.isArray(fonts)) fonts = [];
  }

  function fontStackFor(family, token) {
    const t = token || "--font-sans";
    const cur = (getOverride("global", t) ?? "").trim();
    const def = (defaultValue("global", t) ?? "").trim();
    const q = `"${family}"`;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp("^" + esc + "\\s*,", "i").test(cur)) return cur;
    return def ? `${q}, ${def}` : q;
  }

  function applyFontTo(entry, role) {
    if (role.token) {
      setToken("global", role.token, fontStackFor(entry.family, role.token));
    } else {
      setToken("fontRules", role.rule, entry.family);
    }
    renderGroup();
    showToast(`"${entry.family}" applied to ${role.label.toLowerCase()}`);
  }

  async function uploadFonts(files) {
    if (!files || !files.length) return;
    const suggested = files[0].name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    const answer = prompt(
      files.length > 1 ? `Font family name for ${files.length} files:` : "Font family name:",
      suggested
    );
    if (answer === null) return;
    const family = sanitizeFamilyInput(answer) || suggested;
    let uploaded = 0;
    let lastErr = null;
    for (const file of files) {
      let res;
      try {
        res = await fetch(
          "/__dse/fonts?name=" + encodeURIComponent(file.name) + "&family=" + encodeURIComponent(family),
          { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: await file.arrayBuffer() }
        );
      } catch {
        showToast("Font upload failed");
        return;
      }
      if (res.ok) uploaded++;
      else lastErr = await res.json().catch(() => ({}));
    }
    if (!uploaded) {
      showToast((lastErr && lastErr.error) || "Font upload failed");
      return;
    }
    await loadFonts();
    renderGroup();
    pushToFrame("refreshFonts");
    showToast(`Uploaded ${uploaded} file(s) as "${family}"`);
  }

  function sanitizeFamilyInput(v) {
    return String(v || "")
      .replace(/["\\]/g, "")
      .trim()
      .slice(0, 80);
  }

  function fontsByFamily() {
    const map = new Map();
    for (const f of fonts) {
      if (!map.has(f.family)) map.set(f.family, []);
      map.get(f.family).push(f);
    }
    for (const list of map.values()) list.sort((a, b) => (a.weight || 400) - (b.weight || 400));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }

  function setFontRule(selector, family) {
    const sel = sanitizeFamilyInput(selector);
    if (!sel) {
      showToast("Enter a CSS selector (e.g. button, .card h3)");
      return;
    }
    setToken("fontRules", sel, family);
    renderGroup();
    showToast(`Custom font rule: ${sel} → "${family}"`);
  }

  async function deleteFontFiles(entries) {
    for (const entry of entries) {
      try {
        await fetch("/__dse/fonts/" + encodeURIComponent(entry.file), { method: "DELETE" });
      } catch {}
    }
    await loadFonts();
    renderGroup();
    pushToFrame("refreshFonts");
  }

  function buildFontsSection() {
    const box = document.createElement("div");
    box.className = "fonts-section";
    const head = document.createElement("div");
    head.className = "fonts-head";
    const title = document.createElement("span");
    title.className = "fonts-title";
    title.textContent = "Uploaded fonts";
    const upload = document.createElement("button");
    upload.className = "ghost fonts-upload";
    upload.textContent = "Upload fonts";
    upload.title = "Upload one or more .woff2, .woff, .ttf or .otf files as a font family";
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".woff2,.woff,.ttf,.otf";
    fileInput.multiple = true;
    fileInput.hidden = true;
    fileInput.addEventListener("change", () => {
      const files = [...(fileInput.files || [])];
      fileInput.value = "";
      if (!files.length) return;
      uploadFonts(files);
    });
    upload.onclick = () => fileInput.click();
    head.append(title, upload);
    box.appendChild(head);

    if (fonts.length) {
      for (const [family, entries] of fontsByFamily()) {
        const block = document.createElement("div");
        block.className = "font-family";
        block.dataset.family = family;
        const fhead = document.createElement("div");
        fhead.className = "font-row font-family-head";
        const name = document.createElement("span");
        name.className = "font-name";
        name.textContent = family;
        const meta = document.createElement("span");
        meta.className = "font-meta";
        const weights = entries.map((e) => "w" + (e.weight || 400));
        meta.textContent =
          weights.length > 6 ? weights.slice(0, 6).join(" · ") + ` · +${weights.length - 6}` : weights.join(" · ");
        const actions = document.createElement("div");
        actions.className = "font-actions";
        const ROLE_SHORT = { headings: "Titles", body: "Body", cta: "Buttons", mono: "Mono" };
        for (const role of FONT_ROLES) {
          const label = ROLE_SHORT[role.id];
          if (!label) continue;
          const b = document.createElement("button");
          b.className = "ghost font-apply";
          b.dataset.target = role.token || role.rule;
          b.textContent = label;
          b.title = role.token ? `Set ${role.token} to "${family}", …` : `Apply "${family}" to ${role.rule}`;
          b.onclick = () => applyFontTo({ family }, role);
          actions.appendChild(b);
        }
        const del = document.createElement("button");
        del.className = "ghost font-delete";
        del.textContent = "x";
        del.title = `Delete all files of "${family}"`;
        del.onclick = () => {
          if (!confirm(`Delete all ${entries.length} file(s) of "${family}"?`)) return;
          deleteFontFiles(entries);
        };
        fhead.append(name, meta, actions, del);
        block.appendChild(fhead);

        const filesRow = document.createElement("div");
        filesRow.className = "font-files";
        for (const entry of entries) {
          const fr = document.createElement("div");
          fr.className = "font-file";
          const fn = document.createElement("span");
          fn.className = "font-file-name";
          fn.textContent = entry.file;
          fn.title = entry.file;
          const fm = document.createElement("span");
          fm.className = "font-meta";
          fm.textContent =
            (entry.weight ? "w" + entry.weight : "w?") +
            " · " +
            Math.max(1, Math.round((entry.size || 0) / 1024)) +
            " KB";
          const fdel = document.createElement("button");
          fdel.className = "ghost font-delete";
          fdel.textContent = "x";
          fdel.title = "Delete file";
          fdel.onclick = () => {
            if (!confirm(`Delete font file ${entry.file}?`)) return;
            deleteFontFiles([entry]);
          };
          fr.append(fn, fm, fdel);
          filesRow.appendChild(fr);
        }
        block.appendChild(filesRow);

        const customRow = document.createElement("div");
        customRow.className = "font-custom";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "stack-input font-custom-input";
        input.placeholder = "CSS selector, e.g. button, .card h3";
        input.setAttribute("aria-label", "Custom selector for " + family);
        const applyBtn = document.createElement("button");
        applyBtn.className = "ghost font-custom-btn";
        applyBtn.textContent = "Apply to selector";
        applyBtn.title = "Force this family on the given selector (with !important)";
        const commit = () => {
          if (!input.value.trim()) return;
          setFontRule(input.value, family);
          input.value = "";
        };
        applyBtn.onclick = commit;
        input.onkeydown = (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (!input.isConnected) return;
          commit();
        };
        customRow.append(input, applyBtn);
        block.appendChild(customRow);
        box.appendChild(block);
      }

      const roleSels = new Set(FONT_ROLES.filter((r) => r.rule).map((r) => r.rule));
      const ruleKeys = Object.keys(store.fontRules || {}).filter((sel) => !roleSels.has(sel));
      if (ruleKeys.length) {
        const rulesBox = document.createElement("div");
        rulesBox.className = "font-rules";
        const rTitle = document.createElement("div");
        rTitle.className = "fonts-title";
        rTitle.textContent = "Custom font rules";
        rulesBox.appendChild(rTitle);
        for (const sel of ruleKeys.sort()) {
          const row = document.createElement("div");
          row.className = "font-rule-row";
          row.dataset.selector = sel;
          const label = document.createElement("span");
          label.className = "font-rule-label";
          label.textContent = `${sel} → "${store.fontRules[sel]}"`;
          label.title = sel;
          const rdel = document.createElement("button");
          rdel.className = "ghost font-rule-delete";
          rdel.textContent = "Reset";
          rdel.title = "Remove this custom rule";
          rdel.onclick = () => {
            setToken("fontRules", sel, null);
            renderGroup();
          };
          row.append(label, rdel);
          rulesBox.appendChild(row);
        }
        box.appendChild(rulesBox);
      }
    } else {
      const hint = document.createElement("p");
      hint.className = "empty";
      hint.textContent = "No fonts uploaded yet. Upload a font family (regular, bold, …), then apply it to Sans, Heading, Mono or any selector.";
      box.appendChild(hint);
    }
    return box;
  }

  function familySystemOptions(key) {
    if (key === "--font-mono") return [["System mono", "ui-monospace, 'SF Mono', Menlo, monospace"]];
    return [
      ["System UI", "ui-sans-serif, system-ui, sans-serif"],
      ["Serif", "ui-serif, Georgia, serif"],
    ];
  }

  const FONT_ROLES = [
    { id: "headings", label: "Titles & headings", rule: "h1, h2, h3, h4, h5, h6" },
    { id: "body", label: "Body text", token: "--font-sans" },
    { id: "cta", label: "Buttons & CTAs", rule: '[data-slot="button"], button, [role="button"]' },
    { id: "subtext", label: "Sub text (small)", rule: ".text-xs, .text-sm" },
    { id: "mono", label: "Code & mono", token: "--font-mono" },
  ];

  function roleValue(role) {
    if (role.token) return getOverride("global", role.token);
    return (store.fontRules || {})[role.rule];
  }

  function setRoleValue(role, value) {
    if (role.token) setToken("global", role.token, value || null);
    else setToken("fontRules", role.rule, value || null);
  }

  function roleStack(role, family) {
    if (!role.token) return family;
    const def = defaultValue("global", role.token) ?? "";
    return def ? `"${family}", ${def}` : `"${family}"`;
  }

  function familyDisplay(key, value) {
    const v = String(value || "");
    if (!v) return "Site default";
    const m = v.match(/^\s*"([^"]+)"/);
    if (m) return m[1] + " + fallback";
    if (/^ui-sans-serif/.test(v)) return "System UI";
    if (/^ui-serif|^Georgia/i.test(v)) return "Serif";
    if (/^ui-monospace/.test(v)) return "System mono";
    return v.length > 34 ? v.slice(0, 34) + "…" : v;
  }

  function subLabelRow(text) {
    const el = document.createElement("div");
    el.className = "row-label";
    el.textContent = text;
    return el;
  }

  function rowLabel(key) {
    return key;
  }

  function buildRoleRow(role) {
    const row = document.createElement("div");
    row.className = "token-row role-row";
    row.dataset.role = role.id;
    if (role.token) {
      row.dataset.token = role.token;
      row.dataset.scope = "global";
    }
    row.dataset.kind = "family";
    const ov = roleValue(role);
    if (ov) row.classList.add("edited");
    const main = document.createElement("div");
    main.className = "token-main";
    const name = document.createElement("span");
    name.className = "token-name";
    name.textContent = role.label;
    name.title = role.token ? "Token: " + role.token : "CSS rule: " + role.rule;
    const val = document.createElement("span");
    val.className = "token-value";
    val.textContent = ov ? familyDisplay(role.token || "", ov) : "Site default";
    val.title = ov || "";
    const reset = document.createElement("button");
    reset.className = "token-reset";
    reset.textContent = "↺";
    reset.title = "Reset font role";
    reset.disabled = !ov;
    reset.onclick = () => {
      if (!reset.isConnected) return;
      setRoleValue(role, null);
      renderGroup();
    };
    main.append(name, val, reset);
    row.appendChild(main);
    const controls = document.createElement("div");
    controls.className = "token-controls";
    const findBtn = document.createElement("button");
    findBtn.className = "token-find";
    findBtn.textContent = "Find on page";
    findBtn.title = role.token ? "Highlight elements using " + role.token : "Highlight elements matched by: " + role.rule;
    findBtn.onclick = () => (role.token ? highlightToken("global", role.token) : highlightSelector(role.rule));
    controls.appendChild(findBtn);
    const select = document.createElement("select");
    select.className = "font-select";
    select.setAttribute("aria-label", role.label + " font family");
    select.appendChild(new Option("Site default", ""));
    for (const [label, value] of familySystemOptions(role.token || "--font-sans")) select.appendChild(new Option(label, value));
    for (const [family] of fontsByFamily()) select.appendChild(new Option(family, roleStack(role, family)));
    const cur = ov || "";
    if (cur && ![...select.options].some((o) => o.value === cur))
      select.appendChild(new Option("Custom stack…", cur, false, true));
    select.value = cur;
    select.onchange = () => {
      if (!select.isConnected) return;
      setRoleValue(role, select.value || null);
      renderGroup();
    };
    controls.appendChild(select);
    row.appendChild(controls);
    return row;
  }

  /* ===================== Brand Lab semantic layer ===================== */

  const SECTIONS = [
    { id: "brand", title: "Brand" },
    { id: "typography", title: "Typography" },
    { id: "buttons", title: "Buttons" },
    { id: "surfaces", title: "Surfaces" },
    { id: "spacing", title: "Spacing" },
    { id: "shape", title: "Shape" },
    { id: "effects", title: "Effects" },
    { id: "icons", title: "Icons" },
    { id: "assets", title: "Assets" },
    { id: "handoff", title: "Handoff" },
    { id: "advanced", title: "Advanced" },
  ];

  const BRAND_CONTROLS = [
    {
      id: "primary",
      label: "Primary",
      hint: "Main brand colour — buttons, links, highlights",
      theme: true,
      map: ["--bg-brand", "--border-brand", "--bg-info"],
      globalMap: ["--button-primary"],
      derive: {
        selected: "--bg-brand-selected",
        accessible: ["--bg-brand-accessible"],
        textBrand: ["--text-brand", "--icon-brand"],
        subtle: "--bg-brand-subtle",
        onBrand: "--text-on-brand",
      },
    },
    { id: "secondary", label: "Secondary", hint: "Alternate brand shade (pressed/selected)", theme: true, map: ["--bg-brand-selected"] },
    { id: "accent", label: "Accent", hint: "Accessible brand tint, brand text and icons", theme: true, map: ["--bg-brand-accessible", "--text-brand", "--icon-brand"] },
    { id: "positive", label: "Positive", hint: "Success states and gains", theme: true, map: ["--bg-success", "--bg-price-up", "--text-success", "--text-price-up", "--text-price-positive", "--border-success", "--border-price-up", "--icon-success", "--icon-price-up"] },
    { id: "negative", label: "Negative", hint: "Errors and losses", theme: true, map: ["--bg-error", "--bg-price-down", "--text-error", "--text-price-down", "--border-error", "--icon-error"] },
    { id: "background", label: "App background", hint: "The page canvas", theme: true, map: ["--bg-screen"] },
    { id: "surface", label: "Surface", hint: "Cards, panels and popovers", theme: true, map: ["--bg-container"] },
    { id: "subtle", label: "Subtle surface", hint: "Inputs, chips and secondary fills", theme: true, map: ["--bg-subtle", "--bg-input"] },
    { id: "textPrimary", label: "Primary text", hint: "Default body and heading colour", theme: true, map: ["--text-primary"] },
    { id: "textSecondary", label: "Secondary text", hint: "Supporting copy", theme: true, map: ["--text-subtle"] },
    { id: "textMuted", label: "Muted text", hint: "Disabled and low-emphasis copy", theme: true, map: ["--text-disabled"] },
    { id: "textOnBrand", label: "Text on brand", hint: "Copy over the primary colour", theme: true, map: ["--text-on-brand"] },
    { id: "border", label: "Border", hint: "Card and control outlines", theme: true, map: ["--border-subtle", "--border-unselected"] },
    { id: "divider", label: "Divider", hint: "Separating lines", theme: true, map: ["--border-divider"] },
  ];

  const TYPE_ROLES = [
    { id: "display", label: "Display", sizeKey: "--text-4xl", sel: '[class*="var(--text-4xl)"]', weight: "700" },
    { id: "h1", label: "Heading 1", sizeKey: "--text-3xl", sel: '[class*="var(--text-3xl)"]', weight: "700" },
    { id: "h2", label: "Heading 2", sizeKey: "--text-2xl", sel: '[class*="var(--text-2xl)"]', weight: "600" },
    { id: "h3", label: "Heading 3", sizeKey: "--text-xl", sel: '[class*="var(--text-xl)"]', weight: "600" },
    { id: "body", label: "Body", sizeKey: "--text-base", sel: "body", weight: "400", familyToken: "--font-sans" },
    { id: "small", label: "Small", sizeKey: "--text-sm", sel: '[class*="var(--text-sm)"]', weight: "400" },
    { id: "caption", label: "Caption", sizeKey: "--text-xs", sel: '[class*="var(--text-xs)"]', weight: "500" },
    { id: "cta", label: "CTA", sel: '[data-slot="button"], button', weight: "500", scopedSize: true },
    { id: "mono", label: "Mono", familyToken: "--font-mono", sel: '[class*="var(--font-mono)"], .font-mono' },
  ];

  const SPACING_TOKENS = [
    ["XS", "--space-xs"],
    ["SM", "--space-sm"],
    ["MD", "--space-md"],
    ["LG", "--space-lg"],
    ["XL", "--space-xl"],
    ["2XL", "--space-xxl"],
  ];

  function routeForScope() {
    return scope === "universal" ? null : scope;
  }

  function prettyRoute(route) {
    if (!route) return "All pages";
    if (route === "/") return "Home";
    return route.replace(/^\//, "").replace(/[-/]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function tokenRaw(group, key) {
    const page = pageOverride(group, key);
    if (page !== undefined) return page;
    if (store[group] && store[group][key] !== undefined) return store[group][key];
    return defaults[group] ? defaults[group][key] : undefined;
  }

  function tokenHex(key, group) {
    const raw = tokenRaw(group, key);
    if (raw && HEX_RE.test(String(raw).trim())) return String(raw).trim().toLowerCase();
    const rgb = probe(key, "background-color");
    return rgb ? rgbToHex(rgb) : null;
  }

  function hexRgb(hex) {
    const h = String(hex || "").replace("#", "");
    if (h.length === 3)
      return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
    if (h.length < 6) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function rgbHex(rgb) {
    if (!rgb) return null;
    const hex = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  }

  function mixHex(base, toward, weight) {
    const a = hexRgb(base);
    const b = hexRgb(toward);
    if (!a || !b) return base;
    return rgbHex([0, 1, 2].map((i) => a[i] * (1 - weight) + b[i] * weight));
  }

  function shadeHex(hex, amount) {
    const rgb = hexRgb(hex);
    if (!rgb) return hex;
    const f = (c) => (amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
    return rgbHex(rgb.map(f));
  }

  function ensureContrast(hex, bgHex, min) {
    let out = hex;
    const bg = hexRgb(bgHex) || [255, 255, 255];
    const ligthen = luminance(bg) < 0.5;
    for (let i = 0; i < 16 && contrast(hexRgb(out), bg) < min; i++) out = shadeHex(out, ligthen ? 0.1 : -0.1);
    return out;
  }

  function sizePx(value, fallback = 0) {
    const p = parseSize(value);
    if (!p) return fallback;
    return p.u === "rem" ? p.n * 16 : p.n;
  }

  function colorRow(opts) {
    const row = document.createElement("div");
    row.className = "sem-row" + (opts.edited ? " edited" : "");
    const label = document.createElement("div");
    label.className = "sem-label";
    const name = document.createElement("span");
    name.className = "sem-name";
    name.textContent = opts.label;
    label.appendChild(name);
    if (opts.hint) {
      const hint = document.createElement("span");
      hint.className = "sem-hint";
      hint.textContent = opts.hint;
      label.appendChild(hint);
    }
    if (opts.tokens) {
      const tok = document.createElement("span");
      tok.className = "sem-tokens";
      tok.textContent = opts.tokens;
      tok.title = opts.tokens;
      label.appendChild(tok);
    }
    row.appendChild(label);

    const controls = document.createElement("div");
    controls.className = "sem-controls";
    const swatch = document.createElement("input");
    swatch.type = "color";
    swatch.className = "sem-swatch";
    swatch.value = opts.hex && HEX_RE.test(opts.hex) ? opts.hex : "#000000";
    swatch.setAttribute("aria-label", opts.label + " colour");
    const hex = document.createElement("input");
    hex.type = "text";
    hex.className = "sem-hex";
    hex.value = opts.hex || "";
    hex.placeholder = "#hex";
    hex.setAttribute("aria-label", opts.label + " hex value");
    const reset = document.createElement("button");
    reset.className = "sem-reset";
    reset.textContent = "↺";
    reset.title = "Reset to site default";
    reset.disabled = !opts.edited;

    hex.oninput = () => hex.classList.toggle("invalid", !HEX_RE.test(hex.value.trim()));
    swatch.oninput = () => {
      hex.value = swatch.value;
      hex.classList.remove("invalid");
      opts.onChange(swatch.value);
    };
    const commit = () => {
      const v = hex.value.trim();
      if (!HEX_RE.test(v)) return;
      opts.onChange(v.toLowerCase());
    };
    hex.onchange = commit;
    hex.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      }
    };
    reset.onclick = () => opts.onReset();
    controls.append(swatch, hex, reset);
    row.appendChild(controls);
    return row;
  }

  function sizeRow(opts) {
    const row = document.createElement("div");
    row.className = "sem-row" + (opts.edited ? " edited" : "");
    const label = document.createElement("div");
    label.className = "sem-label";
    const name = document.createElement("span");
    name.className = "sem-name";
    name.textContent = opts.label;
    label.appendChild(name);
    if (opts.hint) {
      const hint = document.createElement("span");
      hint.className = "sem-hint";
      hint.textContent = opts.hint;
      label.appendChild(hint);
    }
    if (opts.tokens) {
      const tok = document.createElement("span");
      tok.className = "sem-tokens";
      tok.textContent = opts.tokens;
      label.appendChild(tok);
    }
    row.appendChild(label);

    const controls = document.createElement("div");
    controls.className = "sem-controls";
    const wrap = document.createElement("div");
    wrap.className = "sem-range-wrap";
    const range = document.createElement("input");
    range.type = "range";
    range.className = "sem-range";
    range.min = String(opts.min ?? 0);
    range.max = String(opts.max ?? 64);
    range.step = String(opts.step ?? 1);
    range.value = String(opts.value ?? 0);
    const num = document.createElement("input");
    num.type = "number";
    num.className = "sem-num";
    num.min = range.min;
    num.max = range.max;
    num.step = range.step;
    num.value = String(Math.round((opts.value ?? 0) * 100) / 100);
    range.oninput = () => {
      num.value = range.value;
      opts.onChange(Number(range.value));
    };
    num.onchange = () => {
      const v = Math.max(Number(range.min), Math.min(Number(range.max), Number(num.value) || 0));
      range.value = String(v);
      opts.onChange(v);
    };
    wrap.append(range, num);
    controls.appendChild(wrap);
    if (opts.unit) {
      const u = document.createElement("span");
      u.className = "sem-range-val";
      u.textContent = opts.unit;
      controls.appendChild(u);
    }
    const reset = document.createElement("button");
    reset.className = "sem-reset";
    reset.textContent = "↺";
    reset.title = "Reset to site default";
    reset.disabled = !opts.edited;
    reset.onclick = () => opts.onReset();
    controls.appendChild(reset);
    row.appendChild(controls);
    return row;
  }

  function selectRow(opts) {
    const row = document.createElement("div");
    row.className = "sem-row" + (opts.edited ? " edited" : "");
    const label = document.createElement("div");
    label.className = "sem-label";
    const name = document.createElement("span");
    name.className = "sem-name";
    name.textContent = opts.label;
    label.appendChild(name);
    if (opts.hint) {
      const hint = document.createElement("span");
      hint.className = "sem-hint";
      hint.textContent = opts.hint;
      label.appendChild(hint);
    }
    row.appendChild(label);
    const controls = document.createElement("div");
    controls.className = "sem-controls";
    const select = document.createElement("select");
    select.className = "sem-select";
    select.setAttribute("aria-label", opts.label);
    for (const [value, text] of opts.options) select.appendChild(new Option(text, value));
    if (opts.value && ![...select.options].some((o) => o.value === opts.value))
      select.appendChild(new Option("Custom…", opts.value, false, true));
    select.value = opts.value || "";
    select.onchange = () => opts.onChange(select.value || null);
    controls.appendChild(select);
    const reset = document.createElement("button");
    reset.className = "sem-reset";
    reset.textContent = "↺";
    reset.title = "Reset to site default";
    reset.disabled = !opts.edited;
    reset.onclick = () => opts.onReset();
    controls.appendChild(reset);
    row.appendChild(controls);
    return row;
  }

  function intro(text) {
    const p = document.createElement("p");
    p.className = "sec-intro";
    p.textContent = text;
    return p;
  }

  function subhead(text) {
    const d = document.createElement("div");
    d.className = "sec-sub";
    d.textContent = text;
    return d;
  }

  function editedIn(groupName, keys) {
    return keys.some((k) => {
      const page = scope !== "universal" ? (store.pages[scope] || {})[groupName] : null;
      return (page && page[k] !== undefined) || (store[groupName] && store[groupName][k] !== undefined);
    });
  }

  function semBadge() {
    const b = document.createElement("span");
    b.className = "sem-badge" + (scope !== "universal" ? " page" : "");
    b.textContent = scope !== "universal" ? prettyRoute(scope) : "All pages";
    return b;
  }

  function renderSemNav() {
    if (!els.semNav) return;
    els.semNav.textContent = "";
    for (const s of SECTIONS) {
      const b = document.createElement("button");
      b.textContent = s.title;
      b.dataset.sec = s.id;
      if (section === s.id) b.classList.add("active");
      b.onclick = () => {
        section = s.id;
        if (s.id === "advanced") {
          if (els.advancedBox) els.advancedBox.open = true;
        }
        renderSemNav();
        renderCenter();
      };
      els.semNav.appendChild(b);
    }
  }

  function renderCenter() {
    if (!advancedOpen) {
      renderSimpleUI();
      return;
    }
    document.body.classList.toggle("view-advanced", section === "advanced");
    renderSemNav();
    renderGroups();
    if (!els.tokenList) return;
    els.tokenList.textContent = "";
    const sec = SECTIONS.find((s) => s.id === section) || SECTIONS[0];
    els.groupTitle.textContent = sec.title + (scope !== "universal" ? " — " + prettyRoute(scope) : "");
    if (section === "advanced") {
      renderGroup();
      return;
    }
    if (section === "brand") renderBrandPanel();
    else if (section === "typography") renderTypographyPanel();
    else if (section === "buttons") renderButtonsPanel();
    else if (section === "surfaces") renderSurfacesPanel();
    else if (section === "spacing") renderSpacingPanel();
    else if (section === "shape") renderShapePanel();
    else if (section === "effects") renderEffectsPanel();
    else if (section === "icons") renderIconsPanel();
    else if (section === "assets") renderAssetsPanel();
    else if (section === "handoff") renderHandoffPanel();
    els.tokenList.scrollTop = 0;
  }

  /* ---------- Brand ---------- */
  function brandControlHex(control) {
    return tokenHex(control.map[0], control.theme ? theme : "global");
  }

  function writeBrandControl(control, hex) {
    const route = routeForScope();
    const updates = [];
    for (const k of control.map) updates.push({ group: control.theme ? theme : "global", key: k, value: hex, route });
    for (const k of control.globalMap || []) updates.push({ group: "global", key: k, value: hex, route });
    const d = control.derive;
    if (d) {
      const screen = tokenHex("--bg-screen", theme) || (theme === "dark" ? "#0d0b1a" : "#ffffff");
      if (d.selected) updates.push({ group: theme, key: d.selected, value: shadeHex(hex, -0.2), route });
      if (d.accessible) {
        const acc = ensureContrast(hex, screen, 3);
        for (const k of d.accessible) updates.push({ group: theme, key: k, value: acc, route });
      }
      if (d.textBrand) {
        const t = ensureContrast(hex, screen, 4.5);
        for (const k of d.textBrand) updates.push({ group: theme, key: k, value: t, route });
      }
      if (d.subtle) updates.push({ group: theme, key: d.subtle, value: mixHex(screen, hex, 0.88), route });
      if (d.onBrand) {
        const white = [255, 255, 255];
        updates.push({
          group: theme,
          key: d.onBrand,
          value: contrast(hexRgb(hex) || white, white) >= 4.5 ? "#ffffff" : "#0d0b1a",
          route,
        });
      }
    }
    setTokenBatch(updates, { rerender: true });
  }

  function resetBrandControl(control) {
    const updates = [];
    for (const k of control.map) updates.push({ group: control.theme ? theme : "global", key: k, value: null, route: routeForScope() });
    for (const k of control.globalMap || []) updates.push({ group: "global", key: k, value: null, route: routeForScope() });
    const d = control.derive;
    if (d) {
      for (const k of [d.selected, d.subtle, d.onBrand].filter(Boolean))
        updates.push({ group: theme, key: k, value: null, route: routeForScope() });
      for (const k of d.accessible || []) updates.push({ group: theme, key: k, value: null, route: routeForScope() });
      for (const k of d.textBrand || []) updates.push({ group: theme, key: k, value: null, route: routeForScope() });
    }
    setTokenBatch(updates, { rerender: true });
  }

  function renderBrandPanel() {
    els.tokenList.appendChild(
      intro(
        `Edit the ${theme} appearance. Primary automatically derives deeper, accessible and subtle brand tints so text stays legible. Use Advanced for raw tokens.`
      )
    );
    els.tokenList.appendChild(semBadge());
    for (const control of BRAND_CONTROLS) {
      const keys = [...control.map, ...(control.globalMap || [])];
      els.tokenList.appendChild(
        colorRow({
          label: control.label,
          hint: control.hint,
          tokens: keys.join("  "),
          hex: brandControlHex(control),
          edited: editedIn(control.theme ? theme : "global", keys),
          onChange: (hex) => writeBrandControl(control, hex),
          onReset: () => resetBrandControl(control),
        })
      );
    }
  }

  /* ---------- Typography ---------- */
  function familySelectOptions(key) {
    const opts = [["", "Site default"]];
    for (const [label, value] of familySystemOptions(key || "--font-sans")) opts.push([value, label]);
    for (const [family] of fontsByFamily()) opts.push([family, family]);
    return opts;
  }

  function roleFamilyValue(role) {
    if (role.id === "mono") return getOverride("global", "--font-mono") || "";
    if (role.id === "body") return getOverride("global", "--font-sans") || "";
    return (store.fontRules || {})[role.sel] || "";
  }

  function setRoleFamily(role, value) {
    if (role.id === "mono") setToken("global", "--font-mono", value || null);
    else if (role.id === "body") setToken("global", "--font-sans", value || null);
    else setToken("fontRules", role.sel, value || null);
    renderCenter();
  }

  function scopedEntryById(id) {
    const page = scope !== "universal" ? ((store.pages[scope] || {}).scoped || {})[id] : null;
    return page || (store.scoped || {})[id] || null;
  }

  function setScopedById(id, sel, prop, value, kind = "value") {
    const route = routeForScope();
    if (value === null || value === undefined || value === "") setScoped(id, null, route);
    else setScoped(id, { sel, prop, value: String(value), kind }, route);
  }

  function roleSizeValue(role) {
    if (role.scopedSize) {
      const e = scopedEntryById("ty:" + role.id + ":size");
      if (e) return sizePx(e.value);
      try {
        const el = iframe.contentDocument.querySelector(role.sel);
        if (el) return Math.round(parseFloat(iframe.contentWindow.getComputedStyle(el).fontSize) || 14);
      } catch {}
      return 14;
    }
    const raw = tokenRaw("global", role.sizeKey);
    return sizePx(raw, 16);
  }

  function roleSizeEdited(role) {
    if (role.scopedSize) return !!scopedEntryById("ty:" + role.id + ":size");
    return editedIn("global", [role.sizeKey]);
  }

  function setRoleSize(role, px) {
    if (role.scopedSize) setScopedById("ty:" + role.id + ":size", role.sel, "font-size", `${Math.round(px)}px`);
    else setTokenBatch([{ group: "global", key: role.sizeKey, value: `${Math.round(px)}px`, route: routeForScope() }]);
    renderCenter();
  }

  function resetRoleSize(role) {
    if (role.scopedSize) setScopedById("ty:" + role.id + ":size", role.sel, "font-size", null);
    else setTokenBatch([{ group: "global", key: role.sizeKey, value: null, route: routeForScope() }]);
    renderCenter();
  }

  function roleStyleRow(role, prop, label, unit, placeholder) {
    const id = `ty:${role.id}:${prop}`;
    const e = scopedEntryById(id);
    return scopedTextRow({
      id,
      label,
      sel: role.sel,
      prop,
      value: e ? e.value : "",
      unit,
      placeholder,
    });
  }

  function scopedTextRow({ id, label, sel, prop, value, unit, placeholder, min, max, type = "text" }) {
    const row = document.createElement("div");
    row.className = "sem-row" + (scopedEntryById(id) ? " edited" : "");
    const labelEl = document.createElement("div");
    labelEl.className = "sem-label";
    const name = document.createElement("span");
    name.className = "sem-name";
    name.textContent = label;
    labelEl.appendChild(name);
    const hint = document.createElement("span");
    hint.className = "sem-hint";
    hint.textContent = prop;
    labelEl.appendChild(hint);
    row.appendChild(labelEl);
    const controls = document.createElement("div");
    controls.className = "sem-controls";
    const input = document.createElement("input");
    input.type = type;
    input.className = "sem-text";
    input.value = value || "";
    input.placeholder = placeholder || "";
    if (min !== undefined) input.min = String(min);
    if (max !== undefined) input.max = String(max);
    input.setAttribute("aria-label", label);
    const commit = () => {
      const v = input.value.trim();
      const out = unit && v && /^-?[\d.]+$/.test(v) ? v + unit : v;
      setScopedById(id, sel, prop, out || null);
      renderCenter();
    };
    input.onchange = commit;
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      }
    };
    const reset = document.createElement("button");
    reset.className = "sem-reset";
    reset.textContent = "↺";
    reset.disabled = !scopedEntryById(id);
    reset.onclick = () => {
      setScopedById(id, sel, prop, null);
      renderCenter();
    };
    controls.append(input, reset);
    row.appendChild(controls);
    return row;
  }

  function renderTypographyPanel() {
    els.tokenList.appendChild(
      intro("Type roles apply across the app. Uploaded fonts can be assigned to any role; sizes write to the type scale tokens.")
    );
    els.tokenList.appendChild(semBadge());
    els.tokenList.appendChild(buildFontsSection());
    els.tokenList.appendChild(subhead("Brand font"));
    const brandFont = selectRow({
      label: "Brand font",
      hint: "Default family for body copy (--font-sans)",
      options: familySelectOptions("--font-sans"),
      value: getOverride("global", "--font-sans") || "",
      edited: editedIn("global", ["--font-sans"]),
      onChange: (v) => setRoleFamily({ id: "body" }, v),
      onReset: () => {
        setToken("global", "--font-sans", null);
        renderCenter();
      },
    });
    els.tokenList.appendChild(brandFont);
    for (const role of TYPE_ROLES) {
      els.tokenList.appendChild(subhead(role.label));
      const family = selectRow({
        label: "Font family",
        hint: role.id === "mono" ? "Mono stack (--font-mono)" : "Role-specific family",
        options: familySelectOptions(role.id === "mono" ? "--font-mono" : "--font-sans"),
        value: roleFamilyValue(role),
        edited: role.id === "mono" || role.id === "body" ? editedIn("global", [role.id === "mono" ? "--font-mono" : "--font-sans"]) : !!((store.fontRules || {})[role.sel]),
        onChange: (v) => setRoleFamily(role, v),
        onReset: () => setRoleFamily(role, null),
      });
      els.tokenList.appendChild(family);
      if (role.sizeKey || role.scopedSize) {
        els.tokenList.appendChild(
          sizeRow({
            label: "Size",
            hint: role.sizeKey || "applies to buttons only",
            min: 8,
            max: 96,
            step: 1,
            value: roleSizeValue(role),
            edited: roleSizeEdited(role),
            unit: "px",
            onChange: (v) => setRoleSize(role, v),
            onReset: () => resetRoleSize(role),
          })
        );
      }
      if (role.id !== "mono") {
        els.tokenList.appendChild(roleStyleRow(role, "font-weight", "Weight", "", role.weight || "auto"));
        els.tokenList.appendChild(roleStyleRow(role, "line-height", "Line height", "", "auto"));
        els.tokenList.appendChild(roleStyleRow(role, "letter-spacing", "Letter spacing", "", "auto"));
      }
    }
  }

  /* ---------- Buttons ---------- */
  const BUTTON_BASE = [
    { id: "btn:height", label: "Height", prop: "height", unit: "px", placeholder: "40" },
    { id: "btn:padding", label: "Horizontal padding", prop: "padding-inline", unit: "px", placeholder: "14" },
    { id: "btn:radius", label: "Radius", prop: "border-radius", unit: "px", placeholder: "9999" },
    { id: "btn:weight", label: "Font weight", prop: "font-weight", placeholder: "500" },
    { id: "btn:size", label: "Font size", prop: "font-size", unit: "px", placeholder: "14" },
  ];

  const BUTTON_STATE_ROWS = [
    { id: "btn:hover", prop: "filter", label: "Hover", placeholder: "brightness(1.08)" },
    { id: "btn:pressed", prop: "filter", label: "Pressed", placeholder: "brightness(0.94)" },
    { id: "btn:disabled", prop: "opacity", label: "Disabled opacity", placeholder: "0.5" },
  ];

  const BUTTON_TOKEN_CONTROLS = [
    { id: "primaryBg", label: "Primary background", group: "global", key: "--button-primary", hint: "Also sets --bg-brand" },
    { id: "primaryText", label: "Primary text", group: "theme", key: "--primary-foreground", hint: "Text on primary buttons" },
    { id: "secondaryBg", label: "Secondary background", group: "theme", key: "--bg-subtle", hint: "Also used by chips and inputs" },
    { id: "secondaryText", label: "Secondary text", group: "theme", key: "--secondary-foreground", hint: "Text on secondary buttons" },
    { id: "destructiveBg", label: "Destructive background", group: "theme", key: "--destructive", hint: "Shared with the negative colour" },
    { id: "destructiveText", label: "Destructive text", group: "theme", key: "--destructive-foreground", hint: "Text on destructive buttons" },
  ];

  function renderButtonsPanel() {
    els.tokenList.appendChild(
      intro("Component-level button controls. Base values apply to every button; variant colours feed the same tokens used by the app.")
    );
    els.tokenList.appendChild(semBadge());
    els.tokenList.appendChild(subhead("All buttons"));
    for (const def of BUTTON_BASE) {
      els.tokenList.appendChild(
        scopedTextRow({
          id: "sem:" + def.id,
          label: def.label,
          sel: '[data-slot="button"]',
          prop: def.prop,
          value: (scopedEntryById("sem:" + def.id) || {}).value || "",
          unit: def.unit,
          placeholder: def.placeholder,
          type: def.prop === "font-weight" ? "text" : "text",
        })
      );
    }
    els.tokenList.appendChild(subhead("Primary"));
    for (const def of BUTTON_TOKEN_CONTROLS.slice(0, 2)) {
      const group = def.group === "theme" ? theme : "global";
      els.tokenList.appendChild(
        colorRow({
          label: def.label,
          hint: def.hint,
          tokens: def.key,
          hex: tokenHex(def.key, group),
          edited: editedIn(group, [def.key]),
          onChange: (hex) => {
            const updates = [{ group, key: def.key, value: hex, route: routeForScope() }];
            if (def.id === "primaryBg") {
              updates.push({ group: theme, key: "--bg-brand", value: hex, route: routeForScope() });
              updates.push({ group: theme, key: "--border-brand", value: hex, route: routeForScope() });
            }
            setTokenBatch(updates, { rerender: true });
          },
          onReset: () => {
            const updates = [{ group, key: def.key, value: null, route: routeForScope() }];
            if (def.id === "primaryBg") {
              updates.push({ group: theme, key: "--bg-brand", value: null, route: routeForScope() });
              updates.push({ group: theme, key: "--border-brand", value: null, route: routeForScope() });
            }
            setTokenBatch(updates, { rerender: true });
          },
        })
      );
    }
    for (const def of BUTTON_STATE_ROWS) {
      els.tokenList.appendChild(
        scopedTextRow({
          id: "sem:" + def.id,
          label: def.label,
          sel: '[data-slot="button"][class*="bg-primary"]',
          prop: def.prop,
          value: (scopedEntryById("sem:" + def.id) || {}).value || "",
          placeholder: def.placeholder,
        })
      );
    }
    els.tokenList.appendChild(subhead("Secondary"));
    for (const def of BUTTON_TOKEN_CONTROLS.slice(2, 4)) {
      const group = def.group === "theme" ? theme : "global";
      els.tokenList.appendChild(
        colorRow({
          label: def.label,
          hint: def.hint,
          tokens: def.key,
          hex: tokenHex(def.key, group),
          edited: editedIn(group, [def.key]),
          onChange: (hex) => setTokenBatch([{ group, key: def.key, value: hex, route: routeForScope() }], { rerender: true }),
          onReset: () => setTokenBatch([{ group, key: def.key, value: null, route: routeForScope() }], { rerender: true }),
        })
      );
    }
    els.tokenList.appendChild(subhead("Destructive"));
    for (const def of BUTTON_TOKEN_CONTROLS.slice(4)) {
      const group = def.group === "theme" ? theme : "global";
      els.tokenList.appendChild(
        colorRow({
          label: def.label,
          hint: def.hint,
          tokens: def.key,
          hex: tokenHex(def.key, group),
          edited: editedIn(group, [def.key]),
          onChange: (hex) => setTokenBatch([{ group, key: def.key, value: hex, route: routeForScope() }], { rerender: true }),
          onReset: () => setTokenBatch([{ group, key: def.key, value: null, route: routeForScope() }], { rerender: true }),
        })
      );
    }
    els.tokenList.appendChild(subhead("Ghost / tertiary"));
    els.tokenList.appendChild(
      scopedTextRow({
        id: "sem:btn:ghost-text",
        label: "Ghost text colour",
        sel: '[data-slot="button"].text-muted-foreground',
        prop: "color",
        value: (scopedEntryById("sem:btn:ghost-text") || {}).value || (tokenHex("--text-subtle", theme) || ""),
        placeholder: tokenHex("--text-subtle", theme) || "#6b6786",
      })
    );
    els.tokenList.appendChild(
      scopedTextRow({
        id: "sem:btn:tertiary-text",
        label: "Tertiary text colour",
        sel: '[data-slot="button"].text-primary',
        prop: "color",
        value: (scopedEntryById("sem:btn:tertiary-text") || {}).value || (tokenHex("--text-brand", theme) || ""),
        placeholder: tokenHex("--text-brand", theme) || "#6b21ff",
      })
    );
  }

  /* ---------- Surfaces / Shape / Effects ---------- */
  function shadowValue(name) {
    const d = SHADOW_DEFAULTS_LOCAL[name] || SHADOW_DEFAULTS_LOCAL.md;
    const s = (store.shadows || {})[name] || {};
    const x = s.x ?? d.x;
    const y = s.y ?? d.y;
    const blur = s.blur ?? d.blur;
    const spread = s.spread ?? d.spread;
    const alpha = s.alpha ?? d.alpha;
    const color = hexRgb(s.color || d.color) || [0, 0, 0];
    return `${x}px ${y}px ${blur}px ${spread}px rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
  }

  const SHADOW_DEFAULTS_LOCAL = {
    sm: { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", alpha: 0.1 },
    md: { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1 },
    lg: { x: 0, y: 10, blur: 15, spread: -3, color: "#000000", alpha: 0.1 },
    xl: { x: 0, y: 20, blur: 25, spread: -5, color: "#000000", alpha: 0.1 },
  };

  function shadowSelectRow({ id, label, sel, value }) {
    const row = document.createElement("div");
    row.className = "sem-row" + (scopedEntryById(id) ? " edited" : "");
    const labelEl = document.createElement("div");
    labelEl.className = "sem-label";
    const name = document.createElement("span");
    name.className = "sem-name";
    name.textContent = label;
    labelEl.appendChild(name);
    const hint = document.createElement("span");
    hint.className = "sem-hint";
    hint.textContent = "box-shadow";
    labelEl.appendChild(hint);
    row.appendChild(labelEl);
    const controls = document.createElement("div");
    controls.className = "sem-controls";
    const select = document.createElement("select");
    select.className = "sem-select";
    for (const [v, t] of [
      ["", "Site default"],
      ["none", "None"],
      ["sm", "Small"],
      ["md", "Medium"],
      ["lg", "Large"],
      ["xl", "Extra large"],
    ])
      select.appendChild(new Option(t, v));
    const cur = value || "";
    const isPreset = ["", "none", "sm", "md", "lg", "xl"].includes(cur);
    if (!isPreset) select.appendChild(new Option("Custom…", cur, false, true));
    select.value = cur;
    select.onchange = () => {
      const v = select.value;
      setScopedById(id, sel, "box-shadow", v ? (v === "none" ? "none" : shadowValue(v)) : null);
      renderCenter();
    };
    const reset = document.createElement("button");
    reset.className = "sem-reset";
    reset.textContent = "↺";
    reset.disabled = !scopedEntryById(id);
    reset.onclick = () => {
      setScopedById(id, sel, "box-shadow", null);
      renderCenter();
    };
    controls.append(select, reset);
    row.appendChild(controls);
    return row;
  }

  function surfaceBlock(title, items) {
    els.tokenList.appendChild(subhead(title));
    for (const item of items) els.tokenList.appendChild(item);
  }

  function renderSurfacesPanel() {
    els.tokenList.appendChild(
      intro("Surface styles are applied as precise component rules: cards, inputs, modals and navigation are restyled without touching the rest of the app.")
    );
    els.tokenList.appendChild(semBadge());

    surfaceBlock("Cards", [
      colorRow({
        label: "Background",
        tokens: "--bg-container",
        hex: tokenHex("--bg-container", theme),
        edited: editedIn(theme, ["--bg-container"]),
        onChange: (hex) => setTokenBatch([{ group: theme, key: "--bg-container", value: hex, route: routeForScope() }], { rerender: true }),
        onReset: () => setTokenBatch([{ group: theme, key: "--bg-container", value: null, route: routeForScope() }], { rerender: true }),
      }),
      colorRow({
        label: "Border",
        tokens: "--border-divider",
        hex: tokenHex("--border-divider", theme),
        edited: editedIn(theme, ["--border-divider"]),
        onChange: (hex) => setTokenBatch([{ group: theme, key: "--border-divider", value: hex, route: routeForScope() }], { rerender: true }),
        onReset: () => setTokenBatch([{ group: theme, key: "--border-divider", value: null, route: routeForScope() }], { rerender: true }),
      }),
      scopedTextRow({ id: "sem:surface:card:radius", label: "Radius", sel: ".bg-card", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:surface:card:radius") || {}).value || "", placeholder: "20" }),
      shadowSelectRow({ id: "sem:surface:card:shadow", label: "Shadow", sel: ".bg-card", value: (scopedEntryById("sem:surface:card:shadow") || {}).value || "" }),
      scopedTextRow({ id: "sem:surface:card:padding", label: "Padding", sel: ".bg-card", prop: "padding", unit: "px", value: (scopedEntryById("sem:surface:card:padding") || {}).value || "", placeholder: "20" }),
    ]);

    surfaceBlock("Inputs", [
      colorRow({
        label: "Background",
        tokens: "--bg-input",
        hex: tokenHex("--bg-input", theme),
        edited: editedIn(theme, ["--bg-input"]),
        onChange: (hex) => setTokenBatch([{ group: theme, key: "--bg-input", value: hex, route: routeForScope() }], { rerender: true }),
        onReset: () => setTokenBatch([{ group: theme, key: "--bg-input", value: null, route: routeForScope() }], { rerender: true }),
      }),
      colorRow({
        label: "Border",
        tokens: "--border-subtle",
        hex: tokenHex("--border-subtle", theme),
        edited: editedIn(theme, ["--border-subtle"]),
        onChange: (hex) => setTokenBatch([{ group: theme, key: "--border-subtle", value: hex, route: routeForScope() }], { rerender: true }),
        onReset: () => setTokenBatch([{ group: theme, key: "--border-subtle", value: null, route: routeForScope() }], { rerender: true }),
      }),
      scopedTextRow({ id: "sem:surface:input:radius", label: "Radius", sel: "input, textarea, select", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:surface:input:radius") || {}).value || "", placeholder: "12" }),
      scopedTextRow({ id: "sem:surface:input:padding", label: "Padding", sel: "input, textarea, select", prop: "padding", unit: "px", value: (scopedEntryById("sem:surface:input:padding") || {}).value || "", placeholder: "10" }),
    ]);

    surfaceBlock("Modals", [
      scopedTextRow({ id: "sem:surface:modal:bg", label: "Background", sel: '[role="dialog"]', prop: "background-color", value: (scopedEntryById("sem:surface:modal:bg") || {}).value || (tokenHex("--bg-container", theme) || ""), placeholder: tokenHex("--bg-container", theme) || "" }),
      scopedTextRow({ id: "sem:surface:modal:radius", label: "Radius", sel: '[role="dialog"]', prop: "border-radius", unit: "px", value: (scopedEntryById("sem:surface:modal:radius") || {}).value || "", placeholder: "24" }),
      shadowSelectRow({ id: "sem:surface:modal:shadow", label: "Shadow", sel: '[role="dialog"]', value: (scopedEntryById("sem:surface:modal:shadow") || {}).value || "" }),
    ]);

    surfaceBlock("Navigation", [
      scopedTextRow({ id: "sem:surface:nav:bg", label: "Background", sel: "nav", prop: "background-color", value: (scopedEntryById("sem:surface:nav:bg") || {}).value || "", placeholder: tokenHex("--bg-container", theme) || "" }),
      scopedTextRow({ id: "sem:surface:nav:border", label: "Border colour", sel: "nav", prop: "border-color", value: (scopedEntryById("sem:surface:nav:border") || {}).value || "", placeholder: tokenHex("--border-divider", theme) || "" }),
    ]);

    surfaceBlock("Brand banners", [
      scopedTextRow({ id: "sem:surface:banner:bg", label: "Background", sel: ".bg-brand-subtle", prop: "background-color", value: (scopedEntryById("sem:surface:banner:bg") || {}).value || "", placeholder: tokenHex("--bg-brand-subtle", theme) || "" }),
      scopedTextRow({ id: "sem:surface:banner:radius", label: "Radius", sel: ".bg-brand-subtle", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:surface:banner:radius") || {}).value || "", placeholder: "16" }),
    ]);
  }

  function renderShapePanel() {
    els.tokenList.appendChild(
      intro("Corner language sets every component radius at once. Individual controls below override one surface at a time.")
    );
    const radiusDefault = sizePx(defaults.global["--radius"], 10) || 10;
    const radiusNow = sizePx(tokenRaw("global", "--radius"), radiusDefault);
    const cornerPct = Math.max(0, Math.min(100, Math.round((radiusNow / radiusDefault) * 50)));
    els.tokenList.appendChild(
      sizeRow({
        label: "Corner language",
        hint: "Sharp ←→ Rounded (writes --radius and component radii)",
        tokens: "--radius",
        min: 0,
        max: 100,
        step: 1,
        value: cornerPct,
        edited: editedIn("global", ["--radius"]),
        onChange: (pct) => {
          const factor = pct / 50;
          const base = radiusDefault * factor;
          const updates = [
            { group: "global", key: "--radius", value: `${Math.round(base * 100) / 100}px`, route: routeForScope() },
            { group: "global", key: "--radius-sm", value: `${Math.round(base * 0.6 * 100) / 100}px`, route: routeForScope() },
            { group: "global", key: "--radius-md", value: `${Math.round(base * 0.8 * 100) / 100}px`, route: routeForScope() },
            { group: "global", key: "--radius-lg", value: `${Math.round(base * 1.2 * 100) / 100}px`, route: routeForScope() },
            { group: "global", key: "--radius-xl", value: `${Math.round(base * 1.6 * 100) / 100}px`, route: routeForScope() },
          ];
          setTokenBatch(updates);
          const comps = [
            ["sem:shape:button", '[data-slot="button"]', Math.max(0, Math.round(base))],
            ["sem:shape:card", ".bg-card", Math.max(0, Math.round(base * 1.4))],
            ["sem:shape:input", "input, textarea, select", Math.max(0, Math.round(base * 0.8))],
            ["sem:shape:modal", '[role="dialog"]', Math.max(0, Math.round(base * 1.8))],
          ];
          for (const [id, sel, px] of comps) setScopedById(id, sel, "border-radius", `${px}px`);
        },
        onReset: () => {
          setTokenBatch([
            { group: "global", key: "--radius", value: null, route: routeForScope() },
            { group: "global", key: "--radius-sm", value: null, route: routeForScope() },
            { group: "global", key: "--radius-md", value: null, route: routeForScope() },
            { group: "global", key: "--radius-lg", value: null, route: routeForScope() },
            { group: "global", key: "--radius-xl", value: null, route: routeForScope() },
          ]);
          for (const [id, sel] of [
            ["sem:shape:button", '[data-slot="button"]'],
            ["sem:shape:card", ".bg-card"],
            ["sem:shape:input", "input, textarea, select"],
            ["sem:shape:modal", '[role="dialog"]'],
          ])
            setScopedById(id, sel, "border-radius", null);
          renderCenter();
        },
      })
    );
    els.tokenList.appendChild(subhead("Component radii"));
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:shape:button", label: "Button radius", sel: '[data-slot="button"]', prop: "border-radius", unit: "px", value: (scopedEntryById("sem:shape:button") || {}).value || "", placeholder: String(Math.round(radiusDefault)) })
    );
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:shape:card", label: "Card radius", sel: ".bg-card", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:shape:card") || {}).value || "", placeholder: String(Math.round(radiusDefault * 1.4)) })
    );
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:shape:input", label: "Input radius", sel: "input, textarea, select", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:shape:input") || {}).value || "", placeholder: String(Math.round(radiusDefault * 0.8)) })
    );
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:shape:modal", label: "Modal radius", sel: '[role="dialog"]', prop: "border-radius", unit: "px", value: (scopedEntryById("sem:shape:modal") || {}).value || "", placeholder: String(Math.round(radiusDefault * 1.8)) })
    );
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:shape:pill", label: "Pill radius", sel: ".rounded-full, [class*='rounded-full']", prop: "border-radius", unit: "px", value: (scopedEntryById("sem:shape:pill") || {}).value || "", placeholder: "9999" })
    );
  }

  function renderEffectsPanel() {
    els.tokenList.appendChild(intro("Shadow presets write the shared shadow tokens; component controls target one surface."));
    els.tokenList.appendChild(subhead("Shadows"));
    for (const name of ["sm", "md", "lg", "xl"]) {
      els.tokenList.appendChild(
        shadowSelectRow({ id: `sem:effect:${name}`, label: `Shadow ${name.toUpperCase()}`, sel: name === "md" ? ".bg-card" : name === "lg" ? '[role="dialog"]' : '[role="menu"], [data-slot="popover-content"]', value: "" })
      );
    }
    els.tokenList.appendChild(subhead("Depth"));
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:effect:blur", label: "Blur", sel: '[class*="backdrop-blur"]', prop: "backdrop-filter", value: (scopedEntryById("sem:effect:blur") || {}).value || "", placeholder: "blur(12px)" })
    );
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:effect:overlay", label: "Overlay opacity", sel: '[data-slot="dialog-overlay"], [role="presentation"]', prop: "background-color", value: (scopedEntryById("sem:effect:overlay") || {}).value || "", placeholder: "rgba(0,0,0,0.5)" })
    );
  }

  function renderIconsPanel() {
    els.tokenList.appendChild(
      intro("Global icon colours follow the semantic palette. To replace an individual icon, use Pick element or the Assets library.")
    );
    for (const [label, key] of [
      ["Primary icon", "--icon-primary"],
      ["Muted icon", "--icon-unselected"],
      ["Brand icon", "--icon-brand"],
      ["Success icon", "--icon-success"],
      ["Warning icon", "--icon-warning"],
      ["Error icon", "--icon-error"],
    ]) {
      els.tokenList.appendChild(
        colorRow({
          label,
          tokens: key,
          hex: tokenHex(key, theme),
          edited: editedIn(theme, [key]),
          onChange: (hex) => setTokenBatch([{ group: theme, key, value: hex, route: routeForScope() }], { rerender: true }),
          onReset: () => setTokenBatch([{ group: theme, key, value: null, route: routeForScope() }], { rerender: true }),
        })
      );
    }
    els.tokenList.appendChild(subhead("Stroke"));
    els.tokenList.appendChild(
      scopedTextRow({ id: "sem:icon:stroke", label: "Icon stroke width", sel: "svg.lucide", prop: "stroke-width", value: (scopedEntryById("sem:icon:stroke") || {}).value || "", placeholder: "2" })
    );
  }

  /* ---------- Spacing ---------- */
  function renderSpacingPanel() {
    els.tokenList.appendChild(
      intro("Spacing values feed layout utilities across the app. The density control scales the whole spacing scale from its defaults.")
    );
    els.tokenList.appendChild(semBadge());
    const spacingDefault = sizePx(defaults.global["--spacing"], 4) || 4;
    const spacingNow = sizePx(tokenRaw("global", "--spacing"), spacingDefault);
    const densityPct = Math.max(0, Math.min(100, Math.round(((spacingNow / spacingDefault) - 0.8) * 250)));
    els.tokenList.appendChild(
      sizeRow({
        label: "Density",
        hint: "Compact ←→ Spacious (scales the spacing scale)",
        min: 0,
        max: 100,
        step: 1,
        value: densityPct,
        edited: editedIn("global", ["--spacing"]),
        onChange: (pct) => {
          const factor = 0.8 + pct / 250;
          const updates = [{ group: "global", key: "--spacing", value: `${Math.round(spacingDefault * factor * 1000) / 1000}px`, route: routeForScope() }];
          for (const [, key] of SPACING_TOKENS) {
            const def = sizePx(defaults.global[key], 0);
            updates.push({ group: "global", key, value: `${Math.round(def * factor)}px`, route: routeForScope() });
          }
          setTokenBatch(updates);
        },
        onReset: () => {
          const updates = [{ group: "global", key: "--spacing", value: null, route: routeForScope() }];
          for (const [, key] of SPACING_TOKENS) updates.push({ group: "global", key, value: null, route: routeForScope() });
          setTokenBatch(updates, { rerender: true });
        },
      })
    );
    els.tokenList.appendChild(subhead("Spacing scale"));
    for (const [label, key] of SPACING_TOKENS) {
      const raw = tokenRaw("global", key);
      const px = sizePx(raw, 0);
      els.tokenList.appendChild(
        sizeRow({
          label,
          tokens: key,
          min: 0,
          max: 160,
          step: 1,
          value: px,
          edited: editedIn("global", [key]),
          unit: "px",
          onChange: (v) => setTokenBatch([{ group: "global", key, value: `${Math.round(v)}px`, route: routeForScope() }]),
          onReset: () => setTokenBatch([{ group: "global", key, value: null, route: routeForScope() }], { rerender: true }),
        })
      );
    }
  }

  /* ---------- Assets library ---------- */
  const LIB_KEY = "dse.assets.library.v1";
  const ASSET_GROUPS = ["Logos", "Photography", "Illustrations", "Backgrounds", "Icons", "Club assets", "Campaign assets"];
  let libGroup = "Logos";

  function loadLibrary() {
    try {
      const raw = localStorage.getItem(LIB_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveLibrary(lib) {
    try {
      localStorage.setItem(LIB_KEY, JSON.stringify(lib));
    } catch {
      showToast("Asset library is full — remove unused assets");
    }
  }

  function libraryThumb(entry) {
    if (entry.kind === "icon") return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(entry.data);
    return entry.data;
  }

  function renderAssetsPanel() {
    els.tokenList.appendChild(
      intro("Upload assets once, then reuse them anywhere. Pick an image or icon first to apply a library asset to that element.")
    );
    const lib = loadLibrary();
    const groups = document.createElement("div");
    groups.className = "lib-groups";
    for (const g of ASSET_GROUPS) {
      const b = document.createElement("button");
      b.textContent = g;
      if (g === libGroup) b.classList.add("active");
      b.onclick = () => {
        libGroup = g;
        renderAssetsPanel();
      };
      groups.appendChild(b);
    }
    els.tokenList.appendChild(groups);

    const head = document.createElement("div");
    head.className = "handoff-head";
    const upload = document.createElement("button");
    upload.className = "primary-btn";
    upload.textContent = "Upload assets";
    upload.onclick = () => els.libFile.click();
    head.appendChild(upload);
    const using = document.createElement("span");
    using.className = "insp-hint";
    using.textContent = pick.selected ? `Picked: ${describeElement(pick.selected)}` : "No element picked";
    head.appendChild(using);
    els.tokenList.appendChild(head);

    const items = Object.entries(lib).filter(([, e]) => e && e.group === libGroup);
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "lib-empty";
      empty.textContent = `No ${libGroup.toLowerCase()} yet — upload files to build the library.`;
      els.tokenList.appendChild(empty);
    } else {
      const grid = document.createElement("div");
      grid.className = "lib-grid";
      for (const [id, entry] of items) {
        const card = document.createElement("div");
        card.className = "lib-item";
        const img = document.createElement("img");
        img.src = libraryThumb(entry);
        img.alt = entry.name || "asset";
        const name = document.createElement("span");
        name.className = "lib-name";
        name.textContent = entry.name || id;
        name.title = entry.name || id;
        const actions = document.createElement("div");
        actions.className = "lib-actions";
        const use = document.createElement("button");
        use.className = "ghost";
        use.textContent = "Use";
        use.title = "Apply to the picked element";
        use.disabled = !pick.selected;
        use.onclick = () => applyLibraryAsset(entry);
        const del = document.createElement("button");
        del.className = "ghost danger-text";
        del.textContent = "x";
        del.title = "Remove from library";
        del.onclick = () => {
          const next = loadLibrary();
          delete next[id];
          saveLibrary(next);
          renderAssetsPanel();
        };
        actions.append(use, del);
        card.append(img, name, actions);
        grid.appendChild(card);
      }
      els.tokenList.appendChild(grid);
    }

    els.tokenList.appendChild(subhead("Applied swaps"));
    const applied = rawGroup("assets");
    const ids = Object.keys(applied).sort();
    if (!ids.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = 'No swaps on this scope yet — pick an image/icon, then choose "Image…", "Icon…" or "Background…".';
      els.tokenList.appendChild(empty);
    } else {
      for (const id of ids) els.tokenList.appendChild(buildAssetRow(id, applied[id]));
    }
  }

  els.libFile.addEventListener("change", async () => {
    const files = [...(els.libFile.files || [])];
    els.libFile.value = "";
    if (!files.length) return;
    const lib = loadLibrary();
    for (const file of files) {
      try {
        const name = file.name || "asset";
        const isSvg = /svg/i.test(file.type) || /\.svg$/i.test(name);
        let data;
        let kind = "image";
        if (isSvg && libGroup === "Icons") {
          data = prepareIconMarkup(await file.text(), {});
          if (!data) {
            showToast(`Skipped ${name}: not a valid SVG`);
            continue;
          }
          kind = "icon";
        } else {
          data = await imageToDataURL(file);
          if (data.length > MAX_ASSET_CHARS) {
            showToast(`Skipped ${name}: file too large`);
            continue;
          }
        }
        lib["l" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)] = {
          name,
          group: libGroup,
          kind,
          data,
        };
      } catch {
        showToast(`Could not read ${file.name}`);
      }
    }
    saveLibrary(lib);
    renderAssetsPanel();
    showToast(`Added ${files.length} asset${files.length === 1 ? "" : "s"} to ${libGroup}`);
  });

  function applyLibraryAsset(entry) {
    const el = pick.selected;
    if (!el) {
      showToast("Pick an element first");
      return;
    }
    const isIcon = entry.kind === "icon";
    const id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const asset = {
      sel: uniqueSelectorFor(el),
      kind: isIcon ? "icon" : "img",
      name: entry.name || "asset",
      data: entry.data,
    };
    setAsset(id, asset, routeForScope());
    renderAssetsPanel();
    showToast("Asset applied to the picked element");
  }

  /* ---------- Handoff ---------- */
  function humanToken(key) {
    const map = {
      "--bg-brand": "Primary",
      "--bg-brand-selected": "Secondary",
      "--bg-brand-accessible": "Accent",
      "--bg-screen": "App background",
      "--bg-container": "Surface",
      "--bg-subtle": "Subtle surface",
      "--text-primary": "Primary text",
      "--text-subtle": "Secondary text",
      "--text-disabled": "Muted text",
      "--text-on-brand": "Text on brand",
      "--border-divider": "Divider",
      "--button-primary": "Button primary",
      "--radius": "Base radius",
    };
    return map[key] || key.replace(/^--/, "").replace(/-/g, " ");
  }

  function buildHandoffReport() {
    const lines = [];
    lines.push("SOCIOS — BRAND CONCEPT");
    lines.push(`Kit: ${activeThemeName || "Working concept"}`);
    lines.push(`Scope: ${prettyRoute(scope)}`);
    lines.push("");
    lines.push("GLOBAL CHANGES");
    const themeKeys = new Set([...Object.keys(store[theme] || {})]);
    let any = false;
    for (const key of [...themeKeys].sort()) {
      const val = store[theme][key];
      const def = (defaults[theme] || {})[key];
      if (!val) continue;
      any = true;
      lines.push(`  ${humanToken(key)} (${theme}): ${def || "—"} → ${val}`);
    }
    for (const key of Object.keys(store.global || {}).sort()) {
      const val = store.global[key];
      if (!val) continue;
      any = true;
      lines.push(`  ${humanToken(key)}: ${(defaults.global || {})[key] || "—"} → ${val}`);
    }
    if (!any) lines.push("  (none)");
    lines.push("");

    const scopedEntries = Object.entries(store.scoped || {});
    const pageEntries = Object.entries(store.pages || {}).filter(([, p]) => p && p.scoped && Object.keys(p.scoped).length);
    if (scopedEntries.length || pageEntries.length) {
      lines.push("COMPONENT / ELEMENT CHANGES");
      for (const [id, e] of scopedEntries) {
        if (!e) continue;
        lines.push(`  ${e.sel} → ${e.prop}: ${e.value}`);
      }
      for (const [route, p] of pageEntries) {
        lines.push(`  [page ${prettyRoute(route)}]`);
        for (const [id, e] of Object.entries(p.scoped)) {
          if (!e) continue;
          lines.push(`    ${e.sel} → ${e.prop}: ${e.value}`);
        }
      }
      lines.push("");
    }

    const assetEntries = Object.entries(store.assets || {});
    if (assetEntries.length) {
      lines.push("ASSETS");
      for (const [id, e] of assetEntries) {
        if (!e) continue;
        lines.push(`  ${e.sel} → ${e.name} (${e.kind})`);
      }
      lines.push("");
    }

    const names = Object.entries(store.texts || {});
    if (names.length) {
      lines.push("LABEL CHANGES");
      for (const [from, to] of names) lines.push(`  "${from}" → "${to}"`);
      lines.push("");
    }
    return lines.join("\n");
  }

  function renderHandoffPanel() {
    els.tokenList.appendChild(
      intro("A human-readable summary of the concept, plus the raw token names and selectors engineering needs to implement it.")
    );
    const head = document.createElement("div");
    head.className = "handoff-head";
    const copyBtn = document.createElement("button");
    copyBtn.className = "primary-btn";
    copyBtn.textContent = "Copy developer spec";
    copyBtn.onclick = () => {
      const text = buildHandoffReport();
      navigator.clipboard?.writeText(text).then(
        () => showToast("Developer spec copied"),
        () => showToast("Copy failed")
      );
    };
    const jsonBtn = document.createElement("button");
    jsonBtn.className = "ghost";
    jsonBtn.textContent = "Download JSON";
    jsonBtn.onclick = () => {
      const blob = new Blob([JSON.stringify(store, null, 2) + "\n"], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "socios-brand-concept.json";
      a.click();
      URL.revokeObjectURL(a.href);
    };
    const assetsBtn = document.createElement("button");
    assetsBtn.className = "ghost";
    assetsBtn.textContent = "Download assets";
    assetsBtn.onclick = downloadAssets;
    head.append(copyBtn, jsonBtn, assetsBtn);
    els.tokenList.appendChild(head);
    const report = document.createElement("pre");
    report.className = "handoff-report";
    report.textContent = buildHandoffReport();
    els.tokenList.appendChild(report);
  }

  function downloadAssets() {
    const all = [];
    for (const [id, e] of Object.entries(store.assets || {})) if (e && e.data) all.push({ name: e.name || id, data: e.data, kind: e.kind });
    for (const [id, e] of Object.entries(loadLibrary())) if (e) all.push({ name: e.name || id, data: e.data, kind: e.kind });
    if (!all.length) {
      showToast("No assets to download");
      return;
    }
    for (const a of all) {
      const href = a.kind === "icon" ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(a.data) : a.data;
      const link = document.createElement("a");
      link.href = href;
      link.download = a.name;
      link.click();
    }
    showToast(`Downloading ${all.length} assets`);
  }

  /* ---------- Comparison ---------- */
  let compareOn = false;
  function setCompare(on) {
    compareOn = !!on;
    sendToFrame("setCompare", compareOn);
    for (const b of els.compareSwitch ? els.compareSwitch.querySelectorAll("button") : []) {
      b.classList.toggle("active", b.dataset.compare === (compareOn ? "original" : "concept"));
    }
    if (els.compareNote) els.compareNote.hidden = !compareOn;
  }

  if (els.compareSwitch) {
    els.compareSwitch.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-compare]");
      if (!b) return;
      setCompare(b.dataset.compare === "original");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "c" && e.key !== "C") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
    if (e.repeat || compareOn) return;
    setCompare(true);
  });
  document.addEventListener("keyup", (e) => {
    if ((e.key === "c" || e.key === "C") && compareOn) setCompare(false);
  });

  function renderGroup() {
    const g = GROUPS.find((x) => x.id === group);
    els.groupTitle.textContent =
      g.title + (g.id === "semantic" ? " — " + theme : "") + (scope !== "universal" ? " — " + scope : "");
    els.tokenList.textContent = "";
    const q = els.filter.value.trim().toLowerCase();
    const onlyEdited = els.onlyEdited.checked;
    const allKeys = groupKeys(g).map((k) => (g.id === "buttons" ? k[0] : k));
    const relevant = new Set(relevantKeys(g, allKeys));
    const bar = usage && g.id !== "texts" ? buildUsageBar(allKeys.length, relevant.size) : null;
    if (bar) els.tokenList.appendChild(bar);
    if (g.id === "typography") els.tokenList.appendChild(buildFontsSection());
    if (g.id === "typography" && !q && !onlyEdited) {
      els.tokenList.appendChild(subLabelRow("Font roles"));
      for (const role of FONT_ROLES) els.tokenList.appendChild(buildRoleRow(role));
      const scaleAll = groupKeys(g).filter((x) => /^(--text-|--leading-)/.test(x));
      const scaleUsed = new Set(relevantKeys(g, scaleAll));
      const scale = usage && !showUnused ? [...scaleUsed] : scaleAll;
      if (scale.length) {
        els.tokenList.appendChild(subLabelRow("Type scale"));
        for (const k of scale) {
          const row = buildRow(k, "global", "size");
          if (usage && !scaleUsed.has(k)) row.classList.add("unused");
          els.tokenList.appendChild(row);
        }
      }
      const weightsAll = groupKeys(g).filter((x) => /^--font-(regular|semibold|bold|black)$/.test(x));
      const weightsUsed = new Set(relevantKeys(g, weightsAll));
      const weights = usage && !showUnused ? [...weightsUsed] : weightsAll;
      if (weights.length) {
        els.tokenList.appendChild(subLabelRow("Font weights"));
        for (const k of weights) {
          const row = buildRow(k, "global", "number");
          if (usage && !weightsUsed.has(k)) row.classList.add("unused");
          els.tokenList.appendChild(row);
        }
      }
      reapplyFlash();
      return;
    }
    if (g.id === "assets") {
      const actions = document.createElement("div");
      actions.className = "asset-actions";
      const hint = document.createElement("span");
      hint.className = "asset-hint";
      const hasRows = groupKeys(g).some((id) => rawGroup("assets")[id]);
      hint.textContent = pick.on
        ? "Now click the image or icon in the preview."
        : hasRows
          ? "Pick another image or icon in the preview to swap it."
          : "Update any image or icon without touching the code: pick it in the preview, then upload a replacement.";
      const pickBtn = document.createElement("button");
      pickBtn.className = "asset-pick-btn";
      pickBtn.textContent = pick.on ? "Cancel picking" : hasRows ? "Add swap" : "Pick on page";
      pickBtn.onclick = () => setPickMode(!pick.on);
      actions.append(hint, pickBtn);
      els.tokenList.appendChild(actions);
      for (const id of groupKeys(g)) {
        const entry = rawGroup("assets")[id];
        if (!entry) continue;
        if (
          q &&
          !String(entry.name || "").toLowerCase().includes(q) &&
          !String(entry.sel || "").toLowerCase().includes(q)
        )
          continue;
        els.tokenList.appendChild(buildAssetRow(id, entry));
      }
      if (!els.tokenList.querySelector(".token-row")) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = els.onlyEdited.checked
          ? "No edited tokens in this group."
          : 'No swaps yet — click "Pick on page", then click an image or icon in the preview.';
        els.tokenList.appendChild(empty);
      }
      reapplyFlash();
      return;
    }
    if (g.id === "scoped") {
      for (const id of groupKeys(g)) {
        if (q && !String(id).toLowerCase().includes(q) && !String((rawGroup("scoped")[id] || {}).token || "").toLowerCase().includes(q)) continue;
        if (els.onlyEdited.checked && !rawGroup("scoped")[id]) continue;
        const entry = rawGroup("scoped")[id];
        if (!entry) continue;
        els.tokenList.appendChild(buildScopedRow(id, entry));
      }
      if (!els.tokenList.querySelector(".token-row")) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = els.onlyEdited.checked
          ? "No edited tokens in this group."
          : 'No scoped overrides yet — pick an element, then choose "Here".';
        els.tokenList.appendChild(empty);
      }
      reapplyFlash();
      return;
    }
    const items =
      g.id === "buttons"
        ? g.keys().map(([k, s, kd]) => [k, s === "theme" ? theme : "global", kd])
        : groupKeys(g).map((k) => [k, scopeOf(g), g.kindOf ? g.kindOf(k) : g.kind]);
    for (const item of items) {
      const [key, sc, kind] = item;
      if (q && !key.toLowerCase().includes(q)) continue;
      if (els.onlyEdited.checked && !getOverride(sc, key)) continue;
      const usedHere = usage && g.id !== "texts" && !relevant.has(key);
      if (usedHere && !showUnused) continue;
      const row = buildRow(key, sc, kind);
      if (usedHere) row.classList.add("unused");
      els.tokenList.appendChild(row);
    }
    if (!els.tokenList.querySelector(".token-row")) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent =
        els.onlyEdited.checked && g.id !== "texts"
          ? "No edited tokens in this group."
          : usage && g.id !== "texts" && g.id !== "scoped" && relevant.size === 0 && !q
            ? "No tokens from this group are used on this page."
            : "No tokens match the filter.";
      els.tokenList.appendChild(empty);
    }
    if (g.id === "semantic") requestContrast();
    reapplyFlash();
  }

  function buildRow(key, sc, kind) {
    const buildRoute = scope;
    const row = document.createElement("div");
    row.className = "token-row";
    row.dataset.token = key;
    row.dataset.scope = sc;
    row.dataset.kind = kind;
    const ov = getOverride(sc, key);
    if (ov) row.classList.add("edited");
    if (isFinding(sc, key)) row.classList.add("finding");

    const main = document.createElement("div");
    main.className = "token-main";
    const name = document.createElement("button");
    name.className = "token-name";
    name.textContent = rowLabel(key);
    if (kind === "text") {
      name.title = key;
    } else {
      name.title = "Click to copy var(" + key + ")";
      name.onclick = () => copy("var(" + key + ")");
    }
    const val = document.createElement("span");
    val.className = "token-value";
    val.textContent =
      kind === "family"
        ? ov
          ? familyDisplay(key, ov) + (pageOverride(sc, key) !== undefined ? " (page)" : " (all pages)")
          : "Site default"
        : ov
          ? effectiveLabel(sc, key)
          : (defaultValue(sc, key) ?? "");
    if (kind === "family") val.title = ov || defaultValue(sc, key) || "";
    main.append(name, val);
    const nScoped = scopedCountForToken(key);
    if (nScoped) {
      const badge = document.createElement("button");
      badge.className = "token-scoped";
      badge.textContent = nScoped + " scoped";
      badge.title = nScoped + " element-scoped override(s) use " + key + " — open Scoped overrides";
      badge.onclick = () => {
        group = "scoped";
        section = "advanced";
        if (els.advancedBox) els.advancedBox.open = true;
        renderCenter();
      };
      main.appendChild(badge);
    }
    const reset = document.createElement("button");
    reset.className = "token-reset";
    reset.textContent = "↺";
    reset.title = "Reset token";
    reset.disabled = !hasOwnOverride(sc, key);
    reset.onclick = () => resetToken(sc, key, buildRoute);
    main.appendChild(reset);
    row.appendChild(main);

    const controls = document.createElement("div");
    controls.className = "token-controls";
    const findBtn = document.createElement("button");
    findBtn.className = "token-find";
    findBtn.textContent = "Find on page";
    findBtn.title = "Highlight elements on the preview page that consume " + key;
    findBtn.onclick = () => highlightToken(sc, key);
    controls.appendChild(findBtn);

    if (kind === "color") {
      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.className = "color-swatch";
      const hex = document.createElement("input");
      hex.type = "text";
      hex.className = "color-hex";
      hex.placeholder = "#hex";
      hex.setAttribute("aria-label", key + " hex value");
      let cur = ov && HEX_RE.test(ov) ? ov : null;
      if (!cur) {
        const probeColor = probe(key, "color");
        cur = probeColor ? rgbToHex(probeColor) : null;
      }
      if (!cur && sc === "palette" && HEX_RE.test(defaultValue(sc, key) || "")) cur = defaultValue(sc, key);
      if (cur) swatch.value = cur;
      hex.value = cur || "";
      if (ov && !HEX_RE.test(ov)) {
        val.textContent = effectiveLabel(sc, key) + " (custom)";
        hex.value = ov;
      }
      hex.oninput = () => {
        const v = hex.value.trim();
        const valid = HEX_RE.test(v);
        hex.classList.toggle("invalid", !valid);
      };
      hex.onchange = () => {
        if (!hex.isConnected) return;
        const v = hex.value.trim();
        if (HEX_RE.test(v)) setToken(sc, key, v.toLowerCase(), buildRoute);
        else if (!v) resetToken(sc, key, buildRoute);
        else hex.classList.add("invalid");
      };
      hex.onkeydown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const v = hex.value.trim();
        if (HEX_RE.test(v)) setToken(sc, key, v.toLowerCase(), buildRoute);
        else if (!v) resetToken(sc, key, buildRoute);
      };
      swatch.oninput = () => {
        hex.value = swatch.value;
        hex.classList.remove("invalid");
        setToken(sc, key, swatch.value, buildRoute);
      };
      controls.append(swatch, hex);
    } else if (kind === "size") {
      const parsed = parseSize(ov ?? defaultValue(sc, key) ?? "0px");
      const { n, u } = parsed || { n: 0, u: "px" };
      const cfg = (GROUPS.find((x) => x.id === group).slider || (() => ({ min: 0, max: 120, step: 1 })))(key);
      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "range";
      slider.min = cfg.min;
      slider.max = cfg.max;
      slider.step = cfg.step;
      slider.value = Math.min(Math.max(n, cfg.min), cfg.max);
      const num = document.createElement("input");
      num.type = "number";
      num.className = "num";
      num.step = cfg.step;
      num.value = n;
      num.setAttribute("aria-label", key + " value");
      const commit = (v) => {
        const clamped = Math.max(0, v);
        setToken(sc, key, fmtSize(clamped, u), buildRoute);
      };
      slider.oninput = () => {
        num.value = slider.value;
        setToken(sc, key, fmtSize(+slider.value, u), buildRoute);
      };
      num.onchange = () => {
        if (!num.isConnected) return;
        commit(+num.value || 0);
      };
      controls.append(slider, num, Object.assign(document.createElement("span"), { className: "token-value", textContent: u }));
    } else if (kind === "stack") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "stack-input";
      input.value = ov ?? defaultValue(sc, key) ?? "";
      input.setAttribute("aria-label", key);
      input.onchange = () => {
        if (!input.isConnected) return;
        input.value.trim() ? setToken(sc, key, input.value.trim(), buildRoute) : resetToken(sc, key, buildRoute);
      };
      controls.append(input);
    } else if (kind === "number") {
      const input = document.createElement("input");
      input.type = "number";
      input.className = "num";
      input.min = 100;
      input.max = 900;
      input.step = 1;
      input.value = parseInt(ov ?? defaultValue(sc, key) ?? "400", 10);
      input.setAttribute("aria-label", key);
      input.onchange = () => {
        if (!input.isConnected) return;
        setToken(sc, key, String(input.value), buildRoute);
      };
      controls.append(input);
    } else if (kind === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "stack-input";
      input.value = ov ?? "";
      input.placeholder = "Replacement text";
      input.setAttribute("aria-label", "Rename " + key);
      const commit = () => setToken(sc, key, input.value.trim() || "", buildRoute);
      input.onchange = () => {
        if (!input.isConnected) return;
        commit();
      };
      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
      };
      controls.append(input);
    } else if (kind === "shadow") {
      const sh = ov || { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", alpha: 0.1 };
      const fields = [
        ["x", -60, 60, 1],
        ["y", -60, 60, 1],
        ["blur", 0, 120, 1],
        ["spread", -40, 40, 1],
        ["alpha", 0, 1, 0.01],
      ];
      for (const [f, min, max, step] of fields) {
        const wrap = document.createElement("label");
        wrap.style.cssText = "display:flex;gap:4px;align-items:center;font-size:11px;color:var(--e-dim)";
        wrap.textContent = f;
        const num = document.createElement("input");
        num.type = "number";
        num.className = "num";
        num.min = min;
        num.max = max;
        num.step = step;
        num.value = sh[f];
        num.onchange = () => {
          if (!num.isConnected) return;
          setToken("shadows", key, { ...sh, [f]: +num.value }, buildRoute);
        };
        wrap.appendChild(num);
        controls.appendChild(wrap);
      }
      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.className = "color-swatch";
      swatch.value = sh.color || "#000000";
      swatch.oninput = () => setToken("shadows", key, { ...sh, color: swatch.value }, buildRoute);
      controls.appendChild(swatch);
      if (hasOwnOverride("shadows", key)) {
        const r = document.createElement("button");
        r.className = "token-reset";
        r.textContent = "↺";
        r.onclick = () => resetToken("shadows", key, buildRoute);
        controls.appendChild(r);
      }
    } else if (kind === "family") {
      const select = document.createElement("select");
      select.className = "font-select";
      select.setAttribute("aria-label", key + " font family");
      const defValue = defaultValue(sc, key) ?? "";
      select.appendChild(new Option("Site default", ""));
      for (const [label, value] of familySystemOptions(key)) select.appendChild(new Option(label, value));
      for (const [family] of fontsByFamily())
        select.appendChild(new Option(family, `"${family}"${defValue ? ", " + defValue : ""}`));
      const cur = ov || "";
      if (cur && ![...select.options].some((o) => o.value === cur))
        select.appendChild(new Option("Custom stack…", cur, false, true));
      select.value = cur;
      select.onchange = () => {
        if (!select.isConnected) return;
        if (!select.value) resetToken(sc, key, buildRoute);
        else setToken(sc, key, select.value, buildRoute);
      };
      controls.appendChild(select);
    }

    row.appendChild(controls);

    if (kind === "color" && CONTRAST_PAIRS[key]) {
      const wrap = document.createElement("div");
      wrap.className = "contrast";
      wrap.dataset.token = key;
      for (const _ of CONTRAST_PAIRS[key]) {
        const b = document.createElement("span");
        b.className = "badge info";
        b.textContent = "…";
        wrap.appendChild(b);
      }
      row.appendChild(wrap);
    }

    return row;
  }

  async function requestContrast() {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc || !doc.body) return;
    const needed = new Set();
    document.querySelectorAll(".contrast").forEach((w) => {
      needed.add(w.dataset.token);
      CONTRAST_PAIRS[w.dataset.token].forEach((bg) => needed.add(bg));
    });
    if (!needed.size) return;
    const prev = doc.documentElement.getAttribute("data-theme");
    doc.documentElement.setAttribute("data-theme", theme);
    const holder = doc.createElement("div");
    holder.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
    doc.body.appendChild(holder);
    const resolved = {};
    for (const t of needed) {
      const s = doc.createElement("span");
      s.style.cssText = `color: var(${t}); background-color: var(${t});`;
      holder.appendChild(s);
      const cs = win.getComputedStyle(s);
      resolved[t] = { color: parseRgb(cs.color), bg: parseRgb(cs.backgroundColor) };
    }
    holder.remove();
    if (prev === null) doc.documentElement.removeAttribute("data-theme");
    else doc.documentElement.setAttribute("data-theme", prev);

    document.querySelectorAll(".contrast").forEach((w) => {
      const key = w.dataset.token;
      const fg = resolved[key].color;
      const badges = w.querySelectorAll(".badge");
      CONTRAST_PAIRS[key].forEach((bgName, i) => {
        const bg = resolved[bgName].bg || resolved[bgName].color;
        const b = badges[i];
        if (!fg || !bg) {
          b.className = "badge info";
          b.textContent = bgName + ": n/a";
          return;
        }
        const r = contrast(fg, bg);
        const isBorder = key.startsWith("--border");
        let cls, label;
        if (isBorder) {
          cls = r >= 1.5 ? "ok" : r >= 1.1 ? "warn" : "fail";
          label = `${bgName} ${r.toFixed(2)}`;
        } else {
          cls = r >= 4.5 ? "ok" : r >= 3 ? "warn" : "fail";
          label = `${bgName} ${r.toFixed(2)}${cls === "fail" ? " AA fail" : cls === "warn" ? " AA large" : " AA"}`;
        }
        b.className = "badge " + cls;
        b.textContent = label;
      });
    });
  }

  function renderGroups() {
    if (!els.groupNav) return;
    els.groupNav.textContent = "";
    for (const g of GROUPS) {
      const b = document.createElement("button");
      b.textContent = g.title;
      b.dataset.id = g.id;
      if (g.id === group) b.classList.add("active");
      const count = document.createElement("span");
      count.className = "count";
      count.textContent = editedCountForGroup(g);
      b.appendChild(count);
      b.onclick = () => {
        group = g.id;
        section = "advanced";
        if (els.advancedBox) els.advancedBox.open = true;
        renderCenter();
      };
      els.groupNav.appendChild(b);
    }
  }

  function renderTheme() {
    if (!els.themeTabs) return;
    for (const b of els.themeTabs.querySelectorAll("button")) {
      const on = b.dataset.theme === theme;
      b.setAttribute("aria-selected", String(on));
    }
  }

  if (els.themeTabs)
    els.themeTabs.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-theme]");
      if (!b) return;
      setTheme(b.dataset.theme);
    });

  function setTheme(t) {
    theme = t;
    renderTheme();
    renderCenter();
  }

  if (els.filter)
    els.filter.addEventListener("input", () => {
      if (advancedOpen && section === "advanced") renderGroup();
    });
  if (els.onlyEdited)
    els.onlyEdited.addEventListener("change", () => {
      if (advancedOpen && section === "advanced") renderGroup();
    });
  if (els.previewPage)
    els.previewPage.addEventListener("change", () => {
      iframe.src = els.previewPage.value;
    });
  if (els.scopeSelect)
    els.scopeSelect.addEventListener("change", () => {
      scope = els.scopeSelect.value || "universal";
      refreshAll();
      if (scope !== "universal") {
        const cur = getPreviewPath();
        if (cur !== null && cur !== scope) iframe.src = scope;
      }
    });
  if (els.btnRemoveScope) els.btnRemoveScope.addEventListener("click", () => {
    if (scope === "universal") return;
    const route = scope;
    if (!confirm(`Remove ALL page overrides for ${route}?`)) return;
    delete store.pages[route];
    scope = "universal";
    saveStore();
    try {
      iframe.contentWindow.__dse?.setTokens?.(store);
    } catch {}
    refreshAll();
    showToast(`Removed page overrides for ${route}`);
  });
  els.btnReload.onclick = () => {
    iframe.src = iframe.src;
  };
  els.btnNewTab.onclick = () => window.open(els.previewPage.value, "_blank");
  if (els.btnImport && els.importFile) els.btnImport.onclick = () => els.importFile.click();
  els.importFile.onchange = async () => {
    const file = els.importFile.files[0];
    els.importFile.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      for (const g of ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"]) {
        if (data[g]) store[g] = { ...data[g] };
      }
      if (data.pages) store.pages = { ...data.pages };
      saveStore();
      try {
        iframe.contentWindow.__dse?.setTokens?.(store);
      } catch {}
      refreshAll();
      showToast("Imported " + file.name);
    } catch {
      showToast("Import failed: not valid JSON");
    }
  };
  els.btnResetAll.onclick = () => {
    if (!confirm("Reset ALL token overrides to the site defaults?")) return;
    store = { v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {}, texts: {}, fontRules: {}, scoped: {}, assets: {}, pages: {} };
    scope = "universal";
    saveStore();
    try {
      iframe.contentWindow.__dse?.reset?.();
    } catch {}
    activeThemeName = null;
    rememberActiveConcept();
    dirty = false;
    clearHighlights();
    refreshAll();
    showToast("All tokens reset");
  };


  function openThemePanel(parsed, source) {
    closeThemePanel();
    pendingTheme = {
      theme: parsed.theme,
      summary: parsed.summary || [],
      mapped: window.SociosThemeSystem.mapTheme(parsed.theme),
      source: source || "json",
    };
    themeErrors = null;
    hideSimplePanels();
    renderThemePanel();
    if (els.themePanel) els.themePanel.hidden = false;
  }

  function showThemeError(errors) {
    closeThemePanel();
    pendingTheme = null;
    themeErrors = (Array.isArray(errors) ? errors : [String(errors || "Invalid theme")]).slice(0, 8);
    hideSimplePanels();
    renderThemePanel();
    if (els.themePanel) els.themePanel.hidden = false;
  }

  function openBuiltinTheme() {
    try {
      const raw = window.SociosThemeSystem.builtin("socios-2026-light");
      openThemePanel(window.SociosThemeSystem.parse(raw), "builtin");
    } catch (err) {
      showThemeError(err && err.errors ? err.errors : [String(err)]);
    }
  }

  function renderThemePanel() {
    if (!els.themeBody) return;
    els.themeBody.textContent = "";
    if (els.themeTitle) els.themeTitle.textContent = themeErrors ? "Theme not valid" : "Theme preview";
    if (themeErrors) {
      const box = document.createElement("div");
      box.className = "theme-error";
      box.textContent = "We couldn't read this theme:";
      const list = document.createElement("ul");
      for (const error of themeErrors) {
        const li = document.createElement("li");
        li.textContent = error;
        list.appendChild(li);
      }
      box.appendChild(list);
      els.themeBody.appendChild(box);
      const note = document.createElement("p");
      note.className = "si-note";
      note.textContent = "Choose another .json file or cancel.";
      els.themeBody.appendChild(note);
    } else if (pendingTheme) {
      const detected = document.createElement("div");
      detected.className = "theme-detected";
      const label = document.createElement("div");
      label.className = "theme-detected-label";
      label.textContent = "Theme detected:";
      const name = document.createElement("div");
      name.className = "theme-detected-name";
      name.textContent = pendingTheme.theme.meta.name;
      detected.append(label, name);
      if (pendingTheme.theme.meta.description) {
        const desc = document.createElement("div");
        desc.className = "theme-detected-desc";
        desc.textContent = pendingTheme.theme.meta.description;
        detected.appendChild(desc);
      }
      if (themePreviewOn) {
        const live = document.createElement("div");
        live.className = "theme-previewing";
        live.textContent = "Previewing live";
        detected.appendChild(live);
      }
      els.themeBody.appendChild(detected);
      const checks = document.createElement("div");
      checks.className = "theme-checks";
      for (const item of pendingTheme.summary) {
        const row = document.createElement("div");
        row.className = "theme-check";
        const title = document.createElement("strong");
        title.textContent = item.label;
        const mark = document.createElement("span");
        mark.className = item.present ? "tick" : "miss";
        mark.textContent = item.present ? "✓" : "—";
        row.append(title, mark);
        checks.appendChild(row);
      }
      els.themeBody.appendChild(checks);
      const note = document.createElement("p");
      note.className = "si-note";
      note.textContent = "Preview applies the theme without saving. Add theme creates a new editable concept.";
      els.themeBody.appendChild(note);
    }
    for (const button of [els.btnThemePreview, els.btnThemeAdd]) {
      if (button) button.disabled = !!themeErrors || !pendingTheme;
    }
  }

  function previewPendingTheme() {
    if (!pendingTheme || themeErrors) return;
    if (!themePreviewSnapshot) {
      themePreviewSnapshot = {
        store: JSON.parse(JSON.stringify(store)),
        active: activeThemeName,
      };
    }
    themePreviewOn = true;
    sendToFrame("previewTokens", pendingTheme.mapped);
    renderThemePanel();
    showToast(`Previewing "${pendingTheme.theme.meta.name}"`);
  }

  function restoreThemePreview() {
    const snapshot = themePreviewSnapshot;
    themePreviewSnapshot = null;
    themePreviewOn = false;
    if (snapshot) sendToFrame("setTokens", snapshot.store);
  }

  function closeThemePanel() {
    restoreThemePreview();
    pendingTheme = null;
    themeErrors = null;
    if (els.themePanel) els.themePanel.hidden = true;
  }

  function addPendingTheme() {
    if (!pendingTheme || themeErrors) return;
    const clean = String(pendingTheme.theme.meta.name || "").trim().slice(0, 80);
    if (!clean) {
      showThemeError(["meta.name is required"]);
      return;
    }
    if (themes[clean] && !confirm(`Replace existing concept "${clean}"?`)) return;
    const mapped = JSON.parse(JSON.stringify(pendingTheme.mapped));
    themes[clean] = {
      savedAt: Date.now(),
      data: mapped,
      themeVersion: 1,
      source: "portable",
      portable: JSON.parse(JSON.stringify(pendingTheme.theme)),
    };
    saveThemes();
    themePreviewSnapshot = null;
    themePreviewOn = false;
    pendingTheme = null;
    themeErrors = null;
    store = mapped;
    ensureStoreGroups();
    lastWritten = JSON.stringify(store);
    try {
      localStorage.setItem(KEY, lastWritten);
    } catch {}
    sendToFrame("setTokens", store);
    activeThemeName = clean;
    dirty = false;
    undoStack.length = 0;
    redoStack.length = 0;
    rememberActiveConcept();
    hideSimplePanels();
    refreshAll();
    setSavedState("Saved");
    showToast(`Added theme "${clean}"`);
  }

  async function readThemeFile(file) {
    if (!file) return;
    if (!/\.json$/i.test(file.name)) {
      showThemeError(["Only .json theme files are supported."]);
      return;
    }
    if (file.size > 1500000) {
      showThemeError(["Theme JSON must be under 1.5 MB."]);
      return;
    }
    let raw = null;
    try {
      raw = JSON.parse(await file.text());
    } catch (err) {
      showThemeError(["The file is not valid JSON.", String(err && err.message ? err.message : err)]);
      return;
    }
    const result = window.SociosThemeSystem.validate(raw);
    if (!result.ok) {
      showThemeError(result.errors);
      return;
    }
    openThemePanel({ theme: result.theme, summary: result.summary }, "upload");
  }

  if (els.btnUploadTheme && els.themeFile)
    els.btnUploadTheme.addEventListener("click", () => els.themeFile.click());
  if (els.themeFile)
    els.themeFile.addEventListener("change", async () => {
      const file = els.themeFile.files && els.themeFile.files[0];
      els.themeFile.value = "";
      await readThemeFile(file);
    });
  if (els.themeClose) els.themeClose.addEventListener("click", closeThemePanel);
  if (els.btnThemeCancel) els.btnThemeCancel.addEventListener("click", closeThemePanel);
  if (els.btnThemePreview) els.btnThemePreview.addEventListener("click", previewPendingTheme);
  if (els.btnThemeAdd) els.btnThemeAdd.addEventListener("click", addPendingTheme);

  /* ===================== Brand, export and advanced panels ===================== */

  function simpleStoreIsEmpty() {
    const groups = ["global", "palette", "dark", "light", "shadows", "texts", "fontRules", "scoped", "assets"];
    const empty = groups.every((g) => !store[g] || Object.keys(store[g]).length === 0);
    const pagesEmpty = !store.pages || Object.values(store.pages).every((p) => !p || Object.values(p).every((g) => !g || Object.keys(g).length === 0));
    return empty && pagesEmpty;
  }

  function humanProp(prop) {
    return {
      "background-color": "Background",
      "background-image": "Background image",
      "background-size": "Background size",
      "background-position": "Background position",
      color: "Text colour",
      "border-radius": "Corners",
      "box-shadow": "Shadow",
      "border-color": "Border colour",
      "border-width": "Border width",
      "border-style": "Border style",
      border: "Border",
      padding: "Spacing",
      "font-size": "Size",
      "font-family": "Font",
      "font-weight": "Weight",
      "line-height": "Line height",
      "letter-spacing": "Letter spacing",
      "backdrop-filter": "Blur",
      "object-fit": "Fit",
      "object-position": "Position",
      width: "Size",
      height: "Size",
      _text: "Text",
    }[prop] || "Style";
  }

  function buildSimpleReport() {
    const lines = [];
    lines.push(activeThemeName || "Current concept");
    lines.push("");
    const grouped = new Map();
    const add = (label, line) => {
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label).push(line);
    };
    for (const [, e] of Object.entries(store.scoped || {})) {
      if (!e || !e.value) continue;
      const label = e.label || (e.kind === "text" ? "Text" : "Element");
      add(label, `  ${humanProp(e.prop)}: ${e.value}`);
    }
    for (const [route, page] of Object.entries(store.pages || {})) {
      for (const [, e] of Object.entries((page && page.scoped) || {})) {
        if (!e || !e.value) continue;
        const label = e.label || "Element";
        add(label, `  ${humanProp(e.prop)}: ${e.value} (${prettyRoute(route)})`);
      }
    }
    for (const [, e] of Object.entries(store.assets || {})) {
      if (!e) continue;
      const kind = e.kind === "icon" ? "Icon" : e.kind === "bg" ? "Background image" : "Image";
      add(kind, `  Replaced with ${e.name || "uploaded file"}`);
    }
    for (const key of Object.keys(store[theme] || {}).sort()) {
      if (!store[theme][key]) continue;
      const name = humanToken(key);
      if (name === key.replace(/^--/, "").replace(/-/g, " ")) continue;
      add("Brand", `  ${name}: ${store[theme][key]}`);
    }
    for (const key of Object.keys(store.global || {}).sort()) {
      if (!store.global[key]) continue;
      const name = humanToken(key);
      if (name === key.replace(/^--/, "").replace(/-/g, " ")) continue;
      add("Brand", `  ${name}: ${store.global[key]}`);
    }
    for (const [from, to] of Object.entries(store.texts || {})) add("Text", `  "${from}" → "${to}"`);
    if (!grouped.size) lines.push("No changes yet.");
    for (const [label, entries] of grouped) {
      lines.push(label);
      lines.push(...entries);
      lines.push("");
    }
    return lines.join("\n").trimEnd();
  }

  function openExportPanel() {
    if (!els.exportPanel) return;
    closeThemePanel();
    hideSimplePanels();
    els.exportReport.textContent = buildSimpleReport();
    if (els.developerReport) els.developerReport.textContent = buildHandoffReport();
    els.exportPanel.hidden = false;
  }

  function closeExportPanel() {
    if (els.exportPanel) els.exportPanel.hidden = true;
  }

  function brandColorControl(id, label) {
    const control = BRAND_CONTROLS.find((c) => c.id === id);
    if (!control) return null;
    return simpleColorControl(label, brandControlHex(control), (hex) => writeBrandControl(control, hex));
  }

  function applyBrandCorners(pct) {
    const radiusDefault = sizePx(defaults.global["--radius"], 10) || 10;
    const base = pct <= 50 ? (pct / 50) * radiusDefault : radiusDefault + ((pct - 50) / 50) * (24 - radiusDefault);
    const round = (n) => Math.round(n * 100) / 100;
    setTokenBatch([
      { group: "global", key: "--radius", value: `${round(base)}px`, route: null },
      { group: "global", key: "--radius-sm", value: `${round(base * 0.6)}px`, route: null },
      { group: "global", key: "--radius-md", value: `${round(base * 0.8)}px`, route: null },
      { group: "global", key: "--radius-lg", value: `${round(base * 1.2)}px`, route: null },
      { group: "global", key: "--radius-xl", value: `${round(base * 1.6)}px`, route: null },
    ]);
  }

  function renderBrandPanelSimple() {
    if (!els.brandBody) return;
    els.brandBody.textContent = "";
    const primary = brandColorControl("primary", "Primary colour");
    const secondary = brandColorControl("secondary", "Secondary colour");
    const background = brandColorControl("background", "Background");
    const surface = brandColorControl("surface", "Card colour");
    const text = brandColorControl("textPrimary", "Main text");
    for (const row of [primary, secondary, background, surface, text]) if (row) els.brandBody.appendChild(row);
    const currentFont = familyDisplay("--font-sans", getOverride("global", "--font-sans") || defaultValue("global", "--font-sans") || "");
    els.brandBody.appendChild(
      simpleSelectControl("Font", simpleFontOptions(), simpleFontValue(iframe.contentDocument?.body) || "", (v) => {
        if (!v) return;
        const stack = /^ui-|^Georgia|^system/i.test(v) ? v : fontStackFor(v, "--font-sans");
        setToken("global", "--font-sans", stack);
      })
    );
    const radiusDefault = sizePx(defaults.global["--radius"], 10) || 10;
    const radiusNow = sizePx(tokenRaw("global", "--radius"), radiusDefault);
    const pct = Math.max(0, Math.min(100, Math.round((radiusNow / 24) * 100)));
    els.brandBody.appendChild(
      simpleRangeControl("Corners", pct, applyBrandCorners, ["Square", "Rounded"])
    );
    const note = document.createElement("p");
    note.className = "si-note";
    note.textContent = "Applies across the whole app. You can still tweak one element later.";
    els.brandBody.appendChild(note);
  }

  function openBrandPanel() {
    closeThemePanel();
    hideSimplePanels();
    closeSimpleInspector();
    setPickMode(false);
    if (els.btnBrandMain) els.btnBrandMain.classList.add("active");
    renderBrandPanelSimple();
    if (els.brandPanel) els.brandPanel.hidden = false;
  }

  function closeBrandPanel() {
    if (els.brandPanel) els.brandPanel.hidden = true;
    if (els.btnBrandMain) els.btnBrandMain.classList.remove("active");
  }

  function openAdvanced() {
    advancedOpen = true;
    closeThemePanel();
    hideSimplePanels();
    clearSimpleOutline();
    if (els.advancedDrawer) els.advancedDrawer.hidden = false;
    document.body.classList.add("view-advanced");
    section = "advanced";
    group = group || "palette";
    renderTheme();
    renderPreviewState();
    renderGroups();
    renderScope();
    renderCenter();
  }

  function closeAdvanced() {
    advancedOpen = false;
    if (els.advancedDrawer) els.advancedDrawer.hidden = true;
    document.body.classList.remove("view-advanced");
    clearSimpleOutline();
    refreshAll();
  }

  if (els.btnSelectMain) els.btnSelectMain.onclick = () => setPickMode(!pick.on);
  if (els.btnBrandMain) els.btnBrandMain.onclick = openBrandPanel;
  if (els.btnAdvanced) els.btnAdvanced.onclick = openAdvanced;
  if (els.btnCloseAdvanced) els.btnCloseAdvanced.onclick = closeAdvanced;
  if (els.siClose) els.siClose.onclick = closeSimpleInspector;
  if (els.siReset) els.siReset.onclick = simpleRemoveOps;
  if (els.siSimilar) els.siSimilar.onclick = applySimpleToSimilar;
  if (els.brandClose) els.brandClose.onclick = closeBrandPanel;
  if (els.exportClose) els.exportClose.onclick = closeExportPanel;
  if (els.btnExport) els.btnExport.onclick = openExportPanel;
  if (els.btnCopyChanges)
    els.btnCopyChanges.onclick = () => {
      const text = buildSimpleReport();
      if (navigator.clipboard?.writeText)
        navigator.clipboard.writeText(text).then(() => showToast("Changes copied"), () => showToast("Copy failed"));
      else showToast("Copy not available");
    };
  if (els.btnExportJson)
    els.btnExportJson.onclick = () => {
      const blob = new Blob([JSON.stringify(store, null, 2) + "\n"], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "socios-concept.json";
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("JSON downloaded");
    };
  if (els.btnExportAssets) els.btnExportAssets.onclick = downloadAssets;

  document.addEventListener("keydown", (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod || String(e.key).toLowerCase() !== "z") return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  });

  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    if (e.newValue === lastWritten) return;
    readStore();
    refreshAll();
  });

  async function init() {
    document.body.classList.add("simple-mode");
    let savedState = "member";
    try {
      savedState = localStorage.getItem(PREVIEW_STATE_KEY) || "member";
    } catch {}
    applyPreviewState(savedState);
    renderPreviewState();
    initPreviewGrip();
    try {
      iframe.src = iframe.src;
    } catch {}
    readStore();
    renderPageOptions();
    if (!defaults) defaults = { global: {}, palette: {}, dark: {}, light: {} };
    for (const g of ["global", "palette", "dark", "light"]) if (!defaults[g]) defaults[g] = {};
    await loadFonts();
    loadThemes();
    const themeNames = Object.keys(themes).sort((a, b) => (themes[b].savedAt || 0) - (themes[a].savedAt || 0));
    let lastConcept = null;
    try {
      lastConcept = localStorage.getItem(ACTIVE_CONCEPT_KEY);
    } catch {}
    if (lastConcept && themes[lastConcept]) activeThemeName = lastConcept;
    if (!themeNames.length) {
      themes["Concept A"] = { savedAt: Date.now(), data: JSON.parse(JSON.stringify(store)) };
      activeThemeName = "Concept A";
      saveThemes();
    } else if (simpleStoreIsEmpty()) {
      const newest = activeThemeName && themes[activeThemeName] ? activeThemeName : themeNames[0];
      store = JSON.parse(JSON.stringify(themes[newest].data));
      ensureStoreGroups();
      activeThemeName = newest;
      saveStore({ silent: true });
      try {
        iframe.contentWindow.__dse?.setTokens?.(store);
      } catch {}
    }
    rememberActiveConcept();
    renderTheme();
    refreshAll();
    setSavedState("Saved");
    try {
      const res = await fetch("/__dse/design-tokens.json");
      if (res.ok) {
        defaults = await res.json();
        for (const g of ["global", "palette", "dark", "light"]) if (!defaults[g]) defaults[g] = {};
        refreshAll();
      }
    } catch {}
    iframe.addEventListener("load", () => {
      if (themePreviewOn && pendingTheme) sendToFrame("previewTokens", pendingTheme.mapped);
      requestContrast();
      try {
        followRoute(getPreviewPath() || "/");
        const t = iframe.contentDocument.documentElement.getAttribute("data-theme");
        if (t === "light" || t === "dark") setTheme(t);
        iframe.contentWindow.__dse?.apply?.();
      } catch {}
      if (!advancedOpen) closeSimpleInspector();
      renderPageOptions();
      if (pick.on) attachPicker();
    });
  }

  init();
})();

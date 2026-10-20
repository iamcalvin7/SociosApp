(() => {
  const ACTIVE_KEY = "dse.studio.active";
  const DRAFTS_KEY = "dse.studio.drafts.v1";
  const ACTIVE_DRAFT_KEY = "dse.studio.activeDraft.v1";
  const ORIGINAL_ID = "__original";
  const url = new URL(location.href);

  if (url.searchParams.get("__studio") === "1") {
    try { sessionStorage.setItem(ACTIVE_KEY, "1"); } catch {}
    url.searchParams.delete("__studio");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }

  let studioActive = false;
  try { studioActive = sessionStorage.getItem(ACTIVE_KEY) === "1"; } catch {}
  if (!studioActive) return;

  const clone = (v) => JSON.parse(JSON.stringify(v));
  const emptyStore = () => ({
    v: 2, global: {}, palette: {}, dark: {}, light: {}, shadows: {},
    texts: {}, fontRules: {}, scoped: {}, assets: {}, pages: {}
  });
  const esc = (v) => (window.CSS && CSS.escape ? CSS.escape(String(v)) : String(v).replace(/[^a-zA-Z0-9_-]/g, "\\$&"));
  const route = () => location.pathname.replace(/\/+$/, "") || "/";

  let drafts = {};
  let activeId = ORIGINAL_ID;
  let selected = null;
  let selectedSelector = "";
  let undoStack = [];
  let redoStack = [];
  let lastChange = null;
  let saveTimer = 0;
  let hovering = null;
  let editMode = true;

  function loadDrafts() {
    try { drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "{}"); } catch { drafts = {}; }
    if (!drafts || typeof drafts !== "object" || Array.isArray(drafts)) drafts = {};
    try {
      const remembered = localStorage.getItem(ACTIVE_DRAFT_KEY);
      if (remembered && (remembered === ORIGINAL_ID || drafts[remembered])) activeId = remembered;
    } catch {}
  }

  function persistDrafts() {
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
      localStorage.setItem(ACTIVE_DRAFT_KEY, activeId);
    } catch {}
  }

  function draftData() {
    return activeId !== ORIGINAL_ID && drafts[activeId] ? drafts[activeId].data : null;
  }

  function ensureGroups(data) {
    const d = data || emptyStore();
    for (const g of ["global","palette","dark","light","shadows","texts","fontRules","scoped","assets"]) {
      if (!d[g] || typeof d[g] !== "object") d[g] = {};
    }
    if (!d.pages || typeof d.pages !== "object") d.pages = {};
    return d;
  }

  function pageGroup(group) {
    const d = ensureGroups(draftData());
    const p = route();
    if (!d.pages[p]) d.pages[p] = {};
    if (!d.pages[p][group]) d.pages[p][group] = {};
    return d.pages[p][group];
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    setState("Saving…");
    saveTimer = setTimeout(() => {
      if (activeId !== ORIGINAL_ID && drafts[activeId]) drafts[activeId].savedAt = Date.now();
      persistDrafts();
      setState("Saved");
    }, 180);
  }

  function setState(text) {
    const el = document.querySelector("#socios-studio-toolbar .studio-state");
    if (el) el.textContent = text;
  }

  function applyActive() {
    clearSelection();
    const link = document.getElementById("dse-premium-css");
    if (activeId === ORIGINAL_ID) {
      document.documentElement.setAttribute("data-studio-original", "");
      if (link) link.media = "not all";
      try { window.__dse?.previewTokens?.(emptyStore()); } catch {}
    } else {
      document.documentElement.removeAttribute("data-studio-original");
      try { window.__dse?.previewTokens?.(ensureGroups(clone(drafts[activeId].data))); } catch {}
    }
    renderToolbar();
  }

  function nextDraftName() {
    const used = new Set(Object.values(drafts).map((d) => d.name));
    let n = 1;
    while (used.has("Draft " + n)) n++;
    return "Draft " + n;
  }

  function duplicateActive() {
    const id = "draft-" + Date.now().toString(36);
    const source = activeId === ORIGINAL_ID ? emptyStore() : clone(drafts[activeId].data);
    drafts[id] = { id, name: nextDraftName(), savedAt: Date.now(), data: ensureGroups(source) };
    activeId = id;
    undoStack = [];
    redoStack = [];
    persistDrafts();
    applyActive();
    setState("Saved");
  }

  function renameActive() {
    if (activeId === ORIGINAL_ID || !drafts[activeId]) return;
    const next = prompt("Rename draft:", drafts[activeId].name);
    if (!next || !next.trim()) return;
    drafts[activeId].name = next.trim();
    drafts[activeId].savedAt = Date.now();
    persistDrafts();
    renderToolbar();
  }

  function snapshot() {
    if (activeId === ORIGINAL_ID || !drafts[activeId]) return;
    undoStack.push(JSON.stringify(drafts[activeId].data));
    if (undoStack.length > 80) undoStack.shift();
    redoStack.length = 0;
    updateUndoRedo();
  }

  function undo() {
    if (activeId === ORIGINAL_ID || !undoStack.length) return;
    redoStack.push(JSON.stringify(drafts[activeId].data));
    drafts[activeId].data = JSON.parse(undoStack.pop());
    scheduleSave();
    applyActive();
    updateUndoRedo();
  }

  function redo() {
    if (activeId === ORIGINAL_ID || !redoStack.length) return;
    undoStack.push(JSON.stringify(drafts[activeId].data));
    drafts[activeId].data = JSON.parse(redoStack.pop());
    scheduleSave();
    applyActive();
    updateUndoRedo();
  }

  function updateUndoRedo() {
    const u = document.getElementById("studioUndo");
    const r = document.getElementById("studioRedo");
    if (u) u.disabled = activeId === ORIGINAL_ID || !undoStack.length;
    if (r) r.disabled = activeId === ORIGINAL_ID || !redoStack.length;
  }

  function switchDraft(id) {
    if (id !== ORIGINAL_ID && !drafts[id]) return;
    activeId = id;
    undoStack = [];
    redoStack = [];
    persistDrafts();
    applyActive();
  }

  function exitStudio() {
    document.documentElement.removeAttribute("data-studio-active");
    try {
      sessionStorage.removeItem(ACTIVE_KEY);
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
      window.__dse?.load?.();
      window.__dse?.apply?.();
    } catch {}
    document.getElementById("socios-studio-toolbar")?.remove();
    document.getElementById("socios-studio-inspector")?.remove();
    clearSelection();
    location.reload();
  }

  function renderToolbar() {
    let bar = document.getElementById("socios-studio-toolbar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "socios-studio-toolbar";
      bar.innerHTML = '<span class="studio-brand">Socios Studio</span><select id="studioDraftSelect" aria-label="Version"></select><button id="studioDuplicate" class="primary">Duplicate</button><button id="studioRename">Rename</button><button id="studioMode">Browse</button><span class="studio-sep"></span><button id="studioUndo">Undo</button><button id="studioRedo">Redo</button><button id="studioSave">Save</button><span class="studio-state">Saved</span><span class="studio-sep"></span><button id="studioExit">Exit</button>';
      document.documentElement.appendChild(bar);
      bar.addEventListener("mousedown", (e) => e.stopPropagation());
      bar.addEventListener("click", (e) => e.stopPropagation());
    }
    const sel = bar.querySelector("#studioDraftSelect");
    sel.textContent = "";
    sel.appendChild(new Option("Original", ORIGINAL_ID));
    Object.values(drafts).sort((a,b) => (b.savedAt||0)-(a.savedAt||0)).forEach((d) => sel.appendChild(new Option(d.name, d.id)));
    sel.value = activeId;
    sel.onchange = () => switchDraft(sel.value);
    bar.querySelector("#studioDuplicate").onclick = duplicateActive;
    bar.querySelector("#studioRename").onclick = renameActive;
    bar.querySelector("#studioRename").disabled = activeId === ORIGINAL_ID;
    const mode = bar.querySelector("#studioMode");
    mode.textContent = editMode ? "Browse" : "Edit";
    mode.disabled = activeId === ORIGINAL_ID;
    mode.onclick = () => {
      editMode = !editMode;
      clearSelection();
      renderToolbar();
    };
    bar.querySelector("#studioUndo").onclick = undo;
    bar.querySelector("#studioRedo").onclick = redo;
    bar.querySelector("#studioSave").onclick = () => { persistDrafts(); setState("Saved"); };
    bar.querySelector("#studioExit").onclick = exitStudio;
    updateUndoRedo();
  }

  function isPresenterUi(el) {
    return !!el?.closest?.('aside[aria-label="Presenter panel"]');
  }

  function isStudioNode(el) {
    return !!el?.closest?.("#socios-studio-toolbar,#socios-studio-inspector,#dse-open-editor") || isPresenterUi(el);
  }

  function resolveTargetAtPoint(e) {
    const hasPoint = Number.isFinite(e.clientX) && Number.isFinite(e.clientY) && (e.clientX !== 0 || e.clientY !== 0);
    const rawStack = (!e.isTrusted || !hasPoint) && e.target ? [e.target] : document.elementsFromPoint(e.clientX, e.clientY);
    const stack = rawStack.filter((el) => el && el !== document.documentElement && el !== document.body && !isStudioNode(el));

    // Prefer actual visible media over clickable ancestor cards. This is critical
    // for cards that use role="button" around an image.
    for (const el of stack) {
      const tag = el.tagName?.toLowerCase?.() || "";
      if (tag === "img") return el;
      if (tag === "picture") return el.querySelector("img") || el;
    }

    for (const el of stack) {
      const tag = el.tagName?.toLowerCase?.() || "";
      if (["path","circle","rect","line","polyline","polygon"].includes(tag)) {
        const chart = chartRoot(el);
        if (chart) return chart;
        return el.closest("svg") || el;
      }
      if (tag === "svg") {
        const chart = chartRoot(el);
        return chart || el;
      }
      const chart = chartRoot(el);
      if (chart) return chart;
    }

    for (const el of stack) {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none") return el;

      const control = el.closest?.("button,[role='button']");
      if (control && !isPresenterUi(control)) return control;

      return el;
    }
    return null;
  }

  function unique(sel) {
    try { return document.querySelectorAll(sel).length === 1; } catch { return false; }
  }

  function segment(el) {
    if (!el || el.nodeType !== 1) return "";
    const tag = el.tagName.toLowerCase();
    const wid = el.getAttribute("data-widget-id");
    if (wid) return '[data-widget-id="' + wid.replace(/"/g,'\\"') + '"]';
    const slot = el.getAttribute("data-slot");
    if (slot) {
      const s = tag + '[data-slot="' + slot.replace(/"/g,'\\"') + '"]';
      if (unique(s)) return s;
    }
    const aria = el.getAttribute("aria-label");
    if (aria && aria.length < 80) {
      const s = tag + '[aria-label="' + aria.replace(/"/g,'\\"') + '"]';
      if (unique(s)) return s;
    }
    if (el.id && !/^(__next|dse-|socios-studio)/.test(el.id)) {
      const s = "#" + esc(el.id);
      if (unique(s)) return s;
    }
    const parent = el.parentElement;
    if (!parent) return tag;
    const same = [...parent.children].filter((n) => n.tagName === el.tagName);
    return same.length > 1 ? tag + ":nth-of-type(" + (same.indexOf(el) + 1) + ")" : tag;
  }

  function selectorFor(el) {
    const direct = segment(el);
    if (direct && unique(direct)) return direct;
    const parts = [];
    let n = el;
    for (let depth = 0; n && n !== document.body && depth < 7; depth++, n = n.parentElement) {
      parts.unshift(segment(n));
      const s = parts.join(" > ");
      if (unique(s)) return s;
      const wid = n.getAttribute?.("data-widget-id");
      if (wid) break;
    }
    return "body > " + parts.join(" > ");
  }

  function chartRoot(el) {
    const svg = el.closest?.("svg");
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const marks = svg.querySelectorAll("path,line,rect,circle,polyline,polygon").length;
    const hint = [
      svg.getAttribute("class") || "",
      svg.getAttribute("aria-label") || "",
      svg.parentElement?.getAttribute("class") || "",
      svg.parentElement?.getAttribute("aria-label") || "",
      svg.closest?.("[data-widget-id]")?.getAttribute("data-widget-id") || ""
    ].join(" ");
    const wideMiniChart = r.width >= 55 && r.height >= 14 && r.height <= 90 && r.width / Math.max(r.height, 1) >= 1.7 && marks >= 2;
    if (/chart|recharts|plot|spark|trend|mover|market|victory|highcharts/i.test(hint) || (r.width > 140 && r.height > 60 && marks >= 8) || wideMiniChart) return svg;
    return null;
  }

  function kindOf(el) {
    if (!el) return "Element";
    if (el.dataset?.studioChart === "1" || chartRoot(el) === el) return "Chart";
    const tag = el.tagName.toLowerCase();
    if (tag === "img" || tag === "picture") return "Image";
    if (tag === "svg" || ["path","circle","rect","line","polyline","polygon"].includes(tag)) return "SVG";
    if (tag === "button" || el.getAttribute("role") === "button") return "Button";
    if (["input","textarea","select"].includes(tag)) return "Input";
    if (/^h[1-6]$/.test(tag) || tag === "p" || tag === "span" || tag === "label" || tag === "a") return "Text";
    return "Element";
  }

  function nameOf(el, kind) {
    if (kind === "Chart") return "Chart";
    const label = el.getAttribute?.("aria-label") || el.getAttribute?.("alt") || el.getAttribute?.("title");
    if (label) return label.slice(0,80);
    const t = (el.textContent || "").trim().replace(/\s+/g," ");
    if (t) return t.slice(0,80);
    return el.tagName.toLowerCase();
  }

  function clearSelection() {
    selected?.removeAttribute?.("data-studio-selected");
    hovering?.removeAttribute?.("data-studio-hover");
    selected = null;
    selectedSelector = "";
    hovering = null;
    const p = document.getElementById("socios-studio-inspector");
    if (p) p.hidden = true;
  }

  function selectElement(raw) {
    if (activeId === ORIGINAL_ID || !raw || isStudioNode(raw)) return;
    const chart = chartRoot(raw);
    selected = chart || raw;
    if (chart) chart.dataset.studioChart = "1";
    selectedSelector = selectorFor(selected);
    document.querySelectorAll("[data-studio-selected]").forEach((n) => n.removeAttribute("data-studio-selected"));
    document.querySelectorAll("[data-studio-hover]").forEach((n) => n.removeAttribute("data-studio-hover"));
    hovering = null;
    selected.setAttribute("data-studio-selected","");
    renderInspector();
  }

  function currentStyle(prop) {
    if (!selected) return "";
    const cs = getComputedStyle(selected);
    return cs.getPropertyValue(prop).trim();
  }

  function changeId(prop, sel = selectedSelector) {
    let h = 0;
    const key = route() + "|" + sel + "|" + prop;
    for (let i=0;i<key.length;i++) h = ((h<<5)-h + key.charCodeAt(i)) | 0;
    return "studio:" + Math.abs(h);
  }

  function applyStyle(prop, value, sel = selectedSelector, label = "") {
    if (activeId === ORIGINAL_ID || !drafts[activeId] || !sel) return;
    snapshot();
    const group = pageGroup("scoped");
    const id = changeId(prop, sel);
    if (value === "" || value == null) delete group[id];
    else group[id] = { sel, prop, value: String(value), kind: /color|fill|stroke/.test(prop) ? "color" : "value", from: "studio", label: label || prop };
    lastChange = { prop, value, selector: sel };
    drafts[activeId].data = ensureGroups(drafts[activeId].data);
    scheduleSave();
    try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
    updateUndoRedo();
  }

  function applyText(value) {
    if (!selectedSelector) return;
    snapshot();
    const group = pageGroup("scoped");
    const id = changeId("_text");
    const from = (selected.textContent || "").trim();
    group[id] = { sel:selectedSelector, prop:"_text", value:String(value), from, kind:"text", label:"Text" };
    lastChange = { prop:"_text", value, selector:selectedSelector };
    scheduleSave();
    try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
  }

  function addRow(parent, label, control) {
    const row = document.createElement("div");
    row.className = "studio-row";
    const l = document.createElement("label");
    l.textContent = label;
    row.append(l, control);
    parent.appendChild(row);
    return control;
  }

  function input(value, onCommit, type="text") {
    const i = document.createElement("input");
    i.type = type;
    i.value = value || "";
    const commit = () => onCommit(i.value);
    i.addEventListener("change", commit);
    if (type !== "color") i.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); commit(); i.blur(); }});
    return i;
  }

  function selectControl(value, values, onCommit) {
    const s = document.createElement("select");
    values.forEach((v) => s.appendChild(new Option(v || "—", v)));
    s.value = values.includes(value) ? value : "";
    s.onchange = () => onCommit(s.value);
    return s;
  }

  function section(body, title) {
    const s = document.createElement("div");
    s.className = "studio-section";
    const h = document.createElement("h4");
    h.textContent = title;
    s.appendChild(h);
    body.appendChild(s);
    return s;
  }

  function rgbToHex(v) {
    const m = String(v).match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return /^#[0-9a-f]{6}$/i.test(v) ? v : "#000000";
    return "#" + [m[1],m[2],m[3]].map((x)=>Number(x).toString(16).padStart(2,"0")).join("");
  }

  function colorRow(parent, label, prop) {
    const wrap = document.createElement("div");
    wrap.className = "studio-inline";
    const c = input(rgbToHex(currentStyle(prop)), (v) => applyStyle(prop,v), "color");
    const t = input(currentStyle(prop), (v) => applyStyle(prop,v));
    c.oninput = () => { t.value = c.value; applyStyle(prop,c.value); };
    t.addEventListener("change", () => { if (/^#[0-9a-f]{6}$/i.test(t.value)) c.value = t.value; });
    wrap.append(c,t);
    addRow(parent,label,wrap);
  }

  function renderChartControls(parent) {
    const shapes = [...selected.querySelectorAll("path,line,rect,circle,polyline,polygon")];
    const colors = new Map();
    for (const el of shapes) {
      const cs = getComputedStyle(el);
      for (const prop of ["stroke","fill"]) {
        const v = cs.getPropertyValue(prop).trim();
        if (!v || v === "none" || v === "transparent" || /rgba?\(0,\s*0,\s*0,\s*0\)/.test(v)) continue;
        const key = prop + "|" + v;
        if (!colors.has(key)) colors.set(key,{prop,value:v,nodes:[]});
        colors.get(key).nodes.push(el);
      }
    }
    [...colors.values()].slice(0,10).forEach((entry, idx) => {
      const c = input(rgbToHex(entry.value), (v) => {
        snapshot();
        for (const node of entry.nodes) {
          const sel = selectorFor(node);
          const group = pageGroup("scoped");
          group[changeId(entry.prop,sel)] = { sel, prop:entry.prop, value:v, kind:"color", from:"studio", label:"Chart "+entry.prop };
        }
        scheduleSave();
        try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
      }, "color");
      addRow(parent,(entry.prop === "stroke" ? "Line " : "Fill ") + (idx+1),c);
    });
    const note = document.createElement("div");
    note.className = "studio-note";
    note.textContent = colors.size ? "Chart colours are detected from the actual SVG, not treated as icons." : "No editable SVG series colours detected.";
    parent.appendChild(note);
  }

  function replaceAsset(file) {
    if (!file || !selectedSelector) return;
    snapshot();
    const reader = new FileReader();
    reader.onload = () => {
      const group = pageGroup("assets");
      const id = "studio:asset:" + Date.now().toString(36);
      if (selected.tagName.toLowerCase() === "img") {
        group[id] = { sel:selectedSelector, kind:"img", data:String(reader.result) };
      } else {
        group[id] = { sel:selectedSelector, kind:"bg", data:String(reader.result) };
      }
      scheduleSave();
      try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
    };
    reader.readAsDataURL(file);
  }

  function replaceSvg(file) {
    if (!file || !selectedSelector) return;
    snapshot();
    const reader = new FileReader();
    reader.onload = () => {
      const markup = String(reader.result || "");
      if (!/<svg[\s>]/i.test(markup)) return;
      const group = pageGroup("assets");
      group["studio:icon:" + Date.now().toString(36)] = { sel:selectedSelector, kind:"icon", data:markup };
      scheduleSave();
      try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
    };
    reader.readAsText(file);
  }

  function resetSelected() {
    if (!selectedSelector) return;
    snapshot();
    const p = drafts[activeId].data.pages?.[route()];
    if (p) {
      for (const groupName of ["scoped","assets"]) {
        const group = p[groupName] || {};
        for (const [id,e] of Object.entries(group)) if (e?.sel === selectedSelector) delete group[id];
      }
    }
    scheduleSave();
    try { window.__dse?.previewTokens?.(clone(drafts[activeId].data)); } catch {}
    renderInspector();
  }

  function applySimilar() {
    if (!lastChange || !selected) return;
    let sel = selected.tagName.toLowerCase();
    const slot = selected.getAttribute("data-slot");
    if (slot) sel += '[data-slot="' + slot.replace(/"/g,'\\"') + '"]';
    else {
      const cls = [...selected.classList].find((c) => /^[a-zA-Z][a-zA-Z0-9_-]{2,40}$/.test(c));
      if (cls) sel += "." + esc(cls);
    }
    if (lastChange.prop === "_text") return;
    applyStyle(lastChange.prop,lastChange.value,sel,"Similar "+lastChange.prop);
  }

  function renderInspector() {
    let panel = document.getElementById("socios-studio-inspector");
    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "socios-studio-inspector";
      document.documentElement.appendChild(panel);
      panel.addEventListener("mousedown",(e)=>e.stopPropagation());
      panel.addEventListener("click",(e)=>e.stopPropagation());
    }
    panel.hidden = false;
    const kind = kindOf(selected);
    panel.innerHTML = '<div class="studio-head"><div class="studio-kicker"></div><div class="studio-title"></div><button class="studio-close" aria-label="Close">×</button></div><div class="studio-body"></div>';
    panel.querySelector(".studio-kicker").textContent = kind.toUpperCase();
    panel.querySelector(".studio-title").textContent = nameOf(selected,kind);
    panel.querySelector(".studio-close").onclick = clearSelection;
    const body = panel.querySelector(".studio-body");

    if (kind === "Text" || kind === "Button") {
      const s = section(body,"Content & type");
      const ta = document.createElement("textarea");
      ta.value = (selected.textContent || "").trim();
      ta.onchange = () => applyText(ta.value);
      addRow(s,"Text",ta);
      addRow(s,"Font",input(currentStyle("font-family"),(v)=>applyStyle("font-family",v)));
      addRow(s,"Weight",input(currentStyle("font-weight"),(v)=>applyStyle("font-weight",v)));
      addRow(s,"Size",input(currentStyle("font-size"),(v)=>applyStyle("font-size",v)));
      addRow(s,"Line height",input(currentStyle("line-height"),(v)=>applyStyle("line-height",v)));
      addRow(s,"Tracking",input(currentStyle("letter-spacing"),(v)=>applyStyle("letter-spacing",v)));
      addRow(s,"Align",selectControl(currentStyle("text-align"),["","left","center","right","justify"],(v)=>applyStyle("text-align",v)));
      addRow(s,"Style",selectControl(currentStyle("font-style"),["","normal","italic"],(v)=>applyStyle("font-style",v)));
      colorRow(s,"Text colour","color");
    }

    if (kind === "Chart") {
      const s = section(body,"Chart");
      renderChartControls(s);
      colorRow(s,"Background","background-color");
      addRow(s,"Opacity",input(currentStyle("opacity"),(v)=>applyStyle("opacity",v)));
    } else if (kind === "SVG") {
      const s = section(body,"SVG");
      colorRow(s,"Fill","fill");
      colorRow(s,"Stroke","stroke");
      addRow(s,"Stroke width",input(currentStyle("stroke-width"),(v)=>applyStyle("stroke-width",v)));
      addRow(s,"Opacity",input(currentStyle("opacity"),(v)=>applyStyle("opacity",v)));
      const file = input("",()=>{},"file");
      file.accept = ".svg,image/svg+xml";
      file.onchange = () => replaceSvg(file.files?.[0]);
      addRow(s,"Replace",file);
    } else if (kind === "Image") {
      const s = section(body,"Image");
      addRow(s,"Width",input(currentStyle("width"),(v)=>applyStyle("width",v)));
      addRow(s,"Height",input(currentStyle("height"),(v)=>applyStyle("height",v)));
      addRow(s,"Fit",selectControl(currentStyle("object-fit"),["","cover","contain","fill","none"],(v)=>applyStyle("object-fit",v)));
      addRow(s,"Position",input(currentStyle("object-position"),(v)=>applyStyle("object-position",v)));
      addRow(s,"Radius",input(currentStyle("border-radius"),(v)=>applyStyle("border-radius",v)));
      addRow(s,"Opacity",input(currentStyle("opacity"),(v)=>applyStyle("opacity",v)));
      const file = input("",()=>{},"file");
      file.accept = "image/*";
      file.onchange = () => replaceAsset(file.files?.[0]);
      addRow(s,"Replace",file);
    }

    if (kind !== "Chart" && kind !== "SVG" && kind !== "Image") {
      const s = section(body,"Appearance");
      if (kind === "Button") {
        const bg = input(currentStyle("background"),(v)=>applyStyle("background",v));
        addRow(s,"Button fill",bg);
        colorRow(s,"Text colour","color");
      } else {
        colorRow(s,"Background","background-color");
        if (kind !== "Text") colorRow(s,"Colour","color");
      }
      colorRow(s,"Border","border-color");
      addRow(s,"Border width",input(currentStyle("border-width"),(v)=>applyStyle("border-width",v)));
      addRow(s,"Radius",input(currentStyle("border-radius"),(v)=>applyStyle("border-radius",v)));
      addRow(s,"Opacity",input(currentStyle("opacity"),(v)=>applyStyle("opacity",v)));
    }

    if (kind !== "Image" && kind !== "SVG" && kind !== "Chart") {
      const bgImage = currentStyle("background-image");
      const hasBgImage = bgImage && bgImage !== "none";
      const s = section(body, hasBgImage ? "Background image" : "Background media");
      if (hasBgImage) {
        const current = document.createElement("div");
        current.className = "studio-note";
        current.textContent = "This element uses a CSS background image. Replace it here.";
        s.appendChild(current);
      }
      const file = input("",()=>{},"file");
      file.accept = "image/*";
      file.onchange = () => replaceAsset(file.files?.[0]);
      addRow(s,"Replace",file);
      addRow(s,"Size",input(currentStyle("background-size"),(v)=>applyStyle("background-size",v)));
      addRow(s,"Position",input(currentStyle("background-position"),(v)=>applyStyle("background-position",v)));
      addRow(s,"Repeat",selectControl(currentStyle("background-repeat"),["","no-repeat","repeat","repeat-x","repeat-y"],(v)=>applyStyle("background-repeat",v)));
    }

    const layout = section(body,"Layout");
    addRow(layout,"Width",input(currentStyle("width"),(v)=>applyStyle("width",v)));
    addRow(layout,"Height",input(currentStyle("height"),(v)=>applyStyle("height",v)));
    addRow(layout,"Padding",input(currentStyle("padding"),(v)=>applyStyle("padding",v)));
    addRow(layout,"Margin",input(currentStyle("margin"),(v)=>applyStyle("margin",v)));
    addRow(layout,"Display",selectControl(currentStyle("display"),["","block","inline","inline-block","flex","inline-flex","grid","none"],(v)=>applyStyle("display",v)));
    addRow(layout,"Gap",input(currentStyle("gap"),(v)=>applyStyle("gap",v)));
    addRow(layout,"Direction",selectControl(currentStyle("flex-direction"),["","row","column","row-reverse","column-reverse"],(v)=>applyStyle("flex-direction",v)));
    addRow(layout,"Justify",selectControl(currentStyle("justify-content"),["","flex-start","center","flex-end","space-between","space-around"],(v)=>applyStyle("justify-content",v)));
    addRow(layout,"Align",selectControl(currentStyle("align-items"),["","stretch","flex-start","center","flex-end"],(v)=>applyStyle("align-items",v)));

    const advanced = section(body,"Any CSS property");
    const prop = input("",()=>{});
    prop.placeholder = "e.g. box-shadow";
    const val = input("",()=>{});
    val.placeholder = "value";
    addRow(advanced,"Property",prop);
    addRow(advanced,"Value",val);
    const apply = document.createElement("button");
    apply.textContent = "Apply property";
    apply.onclick = () => { if (prop.value.trim()) applyStyle(prop.value.trim(),val.value); };
    const actionWrap = document.createElement("div");
    actionWrap.className = "studio-actions";
    actionWrap.appendChild(apply);
    advanced.appendChild(actionWrap);
    const note = document.createElement("div");
    note.className = "studio-note";
    note.textContent = "This fallback means any CSS-capable property can be edited even if Studio has no dedicated control for it.";
    advanced.appendChild(note);

    const actions = section(body,"Actions");
    const wrap = document.createElement("div");
    wrap.className = "studio-actions";
    const similar = document.createElement("button");
    similar.textContent = "Apply last change to similar";
    similar.disabled = !lastChange || lastChange.prop === "_text";
    similar.onclick = applySimilar;
    const hide = document.createElement("button");
    hide.textContent = "Hide";
    hide.onclick = () => applyStyle("display","none");
    const reset = document.createElement("button");
    reset.textContent = "Reset selected";
    reset.onclick = resetSelected;
    const del = document.createElement("button");
    del.textContent = "Delete draft";
    del.className = "studio-danger";
    del.onclick = () => {
      if (activeId === ORIGINAL_ID || !confirm("Delete this draft?")) return;
      delete drafts[activeId];
      activeId = ORIGINAL_ID;
      persistDrafts();
      applyActive();
    };
    wrap.append(similar,hide,reset,del);
    actions.appendChild(wrap);
  }

  document.addEventListener("mousemove",(e)=>{
    if (activeId === ORIGINAL_ID || !editMode || isStudioNode(e.target)) return;
    const target = resolveTargetAtPoint(e);
    if (!target) return;
    if (hovering && hovering !== target && hovering !== selected) hovering.removeAttribute("data-studio-hover");
    hovering = target;
    if (target !== selected) target.setAttribute("data-studio-hover","");
  },true);

  document.addEventListener("mouseleave",()=>{
    if (hovering && hovering !== selected) hovering.removeAttribute("data-studio-hover");
    hovering = null;
  },true);

  document.addEventListener("pointerdown",(e)=>{
    if (activeId === ORIGINAL_ID || !editMode || isStudioNode(e.target)) return;
    const target = resolveTargetAtPoint(e);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    selectElement(target);
  },true);

  document.addEventListener("click",(e)=>{
    if (activeId === ORIGINAL_ID || !editMode || isStudioNode(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },true);

  document.addEventListener("keydown",(e)=>{
    if (e.key === "Escape") clearSelection();
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    }
  });

  function boot() {
    if (!window.__dse) return setTimeout(boot,50);
    document.documentElement.setAttribute("data-studio-active","");
    loadDrafts();
    renderToolbar();
    applyActive();
  }
  boot();
})();
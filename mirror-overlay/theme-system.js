(() => {
  const THEME_VERSION = 1;
  const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  const SIZE = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%)$/;
  const SAFE = /^[^;{}]+$/;

  const BUILTIN = {
    "socios-2026-light": {
      themeVersion: 1,
      meta: {
        name: "Socios 2026 Light",
        description: "Premium light application system: upright Alcyone, restrained surfaces, selective Socios blues and flat controls.",
      },
      colors: {
        primary: "#324CFF",
        primaryHover: "#272ED8",
        primarySubtle: "#EFF3FF",
        background: "#EFF3FF",
        surface: "#FFFFFF",
        strongSurface: "#0E258E",
        primaryText: "#01041C",
        secondaryText: "#697088",
        mutedText: "#9AA0B4",
        textOnPrimary: "#EFF3FF",
        textOnStrongSurface: "#EFF3FF",
        border: "#E2E6F0",
      },
      typography: {
        display: { weight: 500, lineHeight: 1.02, letterSpacing: "-.03em", family: "Alcyone" },
        heading: { weight: 500, lineHeight: 1.12, letterSpacing: "-.02em", family: "Alcyone" },
        body: { weight: 400, lineHeight: 1.45, family: "Alcyone" },
        cta: { weight: 500, lineHeight: 1.2, family: "Alcyone" },
      },
      shape: {
        buttonRadius: 999,
        cardRadius: 20,
        largeCardRadius: 24,
        inputRadius: 10,
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 72,
      },
      buttons: {
        primary: { background: "#324CFF", hover: "#272ED8", text: "#EFF3FF", border: "#324CFF", radius: 999, shadow: "none" },
        secondary: { background: "#FFFFFF", hover: "#F7F8FC", text: "#01041C", border: "#E2E6F0", radius: 999, shadow: "none" },
      },
      cards: {
        standard: { background: "#FFFFFF", text: "#01041C", border: "#E2E6F0", radius: 20, shadow: "none" },
        feature: { background: "#0E258E", text: "#EFF3FF", border: "transparent", radius: 24, shadow: "none" },
      },
      effects: { shadow: "none" },
    },
  };

  BUILTIN["socios-premium-2026"] = JSON.parse(JSON.stringify(BUILTIN["socios-2026-light"]));
  BUILTIN["socios-premium-2026"].meta = {
    name: "Socios Premium 2026",
    description: "Premium application direction with the Socios 2026 Light foundations plus the redesigned responsive homepage, restrained surfaces and selective feature blues.",
  };

  const SECTION_LABELS = {
    colors: "Colours",
    typography: "Typography",
    buttons: "Buttons",
    cards: "Cards",
    shape: "Shape",
    spacing: "Spacing",
  };

  const COLOR_KEYS = [
    "primary",
    "primaryHover",
    "primarySubtle",
    "background",
    "surface",
    "strongSurface",
    "primaryText",
    "secondaryText",
    "mutedText",
    "textOnPrimary",
    "textOnStrongSurface",
    "border",
    "positive",
    "negative",
    "warning",
  ];

  const ROLE_SELECTORS = {
    display: 'h1, [class*="text-5xl"], [class*="text-6xl"], [class*="text-7xl"]',
    heading: "h2, h3, h4, h5, h6",
    body: "body, p",
    cta: '[data-slot="button"], button, [role="button"]',
  };

  const PRIMARY_BUTTON =
    'button[data-slot="button"][class*="text-primary-foreground"], button[class*="--primary:var(--button-primary)"], [role="button"][class*="text-primary-foreground"]';
  const SECONDARY_BUTTON =
    'button[data-slot="button"][class*="text-secondary-foreground"], [role="button"][class*="text-secondary-foreground"]';
  const STANDARD_CARD =
    '[data-card-surface], [data-slot="card"], .bg-card:not(button):not(a):not(input):not(select):not(textarea)';
  const FEATURE_CARD =
    '[data-card-surface][style*="--on-dark-card-bg"], .bg-inverse, [class*="bg-inverse"], [class*="bg-[var(--bg-inverse)]"]';
  const INPUT_SELECTOR =
    'input:not([type="checkbox"]):not([type="radio"]), textarea, select';
  const SHADOW_SELECTOR = ".shadow-sm, .shadow-md, .shadow-lg, .shadow-xl";

  function isObject(v) {
    return !!v && typeof v === "object" && !Array.isArray(v);
  }

  function text(v) {
    return typeof v === "string" ? v.trim() : "";
  }

  function round(n) {
    return Math.round(n * 1000) / 1000;
  }

  function hex(v) {
    const s = text(v);
    if (!HEX.test(s)) return null;
    if (s.length === 4) return ("#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toLowerCase();
    return s.toLowerCase();
  }

  function color(v, allowTransparent) {
    const s = text(v).toLowerCase();
    if (allowTransparent && s === "transparent") return "transparent";
    return hex(v);
  }

  function size(v) {
    if (typeof v === "number" && Number.isFinite(v)) return `${round(v)}px`;
    const s = text(v);
    if (!s) return null;
    if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)) return `${s}px`;
    return SIZE.test(s) ? s : null;
  }

  function radius(v) {
    const s = size(v);
    if (!s) return null;
    const m = /^(-?\d+(?:\.\d+)?)px$/.exec(s);
    if (!m) return s;
    return `${round(Math.max(0, parseFloat(m[1])))}px`;
  }

  function weight(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 100 || n > 900) return null;
    return Math.round(n / 100) * 100;
  }

  function lineHeight(v) {
    if (typeof v === "number" && Number.isFinite(v)) return String(round(v));
    const s = text(v);
    if (!s) return null;
    if (/^\d*\.?\d+$/.test(s)) return s;
    return SIZE.test(s) ? s : null;
  }

  function letterSpacing(v) {
    if (typeof v === "number" && Number.isFinite(v)) return `${round(v)}em`;
    const s = text(v);
    if (!s) return null;
    if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)) return `${s}em`;
    return SIZE.test(s) ? s : null;
  }

  function family(v) {
    const s = text(v);
    if (!s || s.length > 120 || !SAFE.test(s) || s.includes('"')) return null;
    return s;
  }

  function shadow(v) {
    if (v === undefined || v === null || v === "") return null;
    if (typeof v === "string") {
      const s = v.trim();
      if (!s || !SAFE.test(s)) return null;
      return s;
    }
    if (!isObject(v)) return null;
    const n = (k, d) => {
      const x = Number(v[k]);
      return Number.isFinite(x) ? x : d;
    };
    const c = hex(v.color) || "#000000";
    const alpha = Number.isFinite(Number(v.alpha)) ? Math.max(0, Math.min(1, Number(v.alpha))) : 0.1;
    return `${n("x", 0)}px ${n("y", 4)}px ${n("blur", 6)}px ${n("spread", -1)}px ${hexToRgba(c, alpha)}`;
  }

  function hexToRgba(h, alpha) {
    const s = String(h || "#000000").replace("#", "");
    const rgb = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) || 0);
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }

  function normalizeColors(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("colors must be an object");
      return out;
    }
    for (const key of COLOR_KEYS) {
      if (raw[key] === undefined || raw[key] === "") continue;
      const value = color(raw[key], false);
      if (!value) {
        errors.push(`colors.${key} must be a hex colour`);
        continue;
      }
      out[key] = value;
    }
    return out;
  }

  function normalizeRole(raw, label, errors) {
    if (raw === undefined) return null;
    if (!isObject(raw)) {
      errors.push(`typography.${label} must be an object`);
      return null;
    }
    const out = {};
    if (raw.weight !== undefined) {
      const v = weight(raw.weight);
      if (v === null) errors.push(`typography.${label}.weight must be 100–900`);
      else out.weight = v;
    }
    if (raw.lineHeight !== undefined) {
      const v = lineHeight(raw.lineHeight);
      if (!v) errors.push(`typography.${label}.lineHeight is invalid`);
      else out.lineHeight = v;
    }
    if (raw.letterSpacing !== undefined) {
      const v = letterSpacing(raw.letterSpacing);
      if (!v) errors.push(`typography.${label}.letterSpacing is invalid`);
      else out.letterSpacing = v;
    }
    if (raw.family !== undefined || raw.fontFamily !== undefined) {
      const v = family(raw.family ?? raw.fontFamily);
      if (!v) errors.push(`typography.${label}.family is invalid`);
      else out.family = v;
    }
    return Object.keys(out).length ? out : null;
  }

  function normalizeTypography(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("typography must be an object");
      return out;
    }
    for (const role of ["display", "heading", "body", "cta"]) {
      const value = normalizeRole(raw[role], role, errors);
      if (value) out[role] = value;
    }
    return out;
  }

  function normalizeShape(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("shape must be an object");
      return out;
    }
    for (const key of ["buttonRadius", "cardRadius", "largeCardRadius", "inputRadius"]) {
      if (raw[key] === undefined || raw[key] === "") continue;
      const v = radius(raw[key]);
      if (!v) errors.push(`shape.${key} must be a radius`);
      else out[key] = v;
    }
    return out;
  }

  function normalizeSpacing(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("spacing must be an object");
      return out;
    }
    for (const key of ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"]) {
      if (raw[key] === undefined || raw[key] === "") continue;
      const v = size(raw[key]);
      if (!v) errors.push(`spacing.${key} must be a size`);
      else out[key] = v;
    }
    return out;
  }

  function normalizeButton(raw, label, errors) {
    if (raw === undefined) return null;
    if (!isObject(raw)) {
      errors.push(`buttons.${label} must be an object`);
      return null;
    }
    const out = {};
    if (raw.background !== undefined) {
      const v = color(raw.background, true);
      if (!v) errors.push(`buttons.${label}.background is invalid`);
      else out.background = v;
    }
    if (raw.hover !== undefined) {
      const v = color(raw.hover, true);
      if (!v) errors.push(`buttons.${label}.hover is invalid`);
      else out.hover = v;
    }
    if (raw.text !== undefined) {
      const v = color(raw.text, true);
      if (!v) errors.push(`buttons.${label}.text is invalid`);
      else out.text = v;
    }
    if (raw.border !== undefined) {
      const v = color(raw.border, true);
      if (!v) errors.push(`buttons.${label}.border is invalid`);
      else out.border = v;
    }
    if (raw.radius !== undefined) {
      const v = radius(raw.radius);
      if (!v) errors.push(`buttons.${label}.radius is invalid`);
      else out.radius = v;
    }
    if (raw.shadow !== undefined) {
      const v = shadow(raw.shadow);
      if (!v) errors.push(`buttons.${label}.shadow is invalid`);
      else out.shadow = v;
    }
    return Object.keys(out).length ? out : null;
  }

  function normalizeButtons(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("buttons must be an object");
      return out;
    }
    for (const key of ["primary", "secondary"]) {
      const value = normalizeButton(raw[key], key, errors);
      if (value) out[key] = value;
    }
    return out;
  }

  function normalizeCard(raw, label, errors) {
    if (raw === undefined) return null;
    if (!isObject(raw)) {
      errors.push(`cards.${label} must be an object`);
      return null;
    }
    const out = {};
    if (raw.background !== undefined) {
      const v = color(raw.background, true);
      if (!v) errors.push(`cards.${label}.background is invalid`);
      else out.background = v;
    }
    if (raw.text !== undefined) {
      const v = color(raw.text, true);
      if (!v) errors.push(`cards.${label}.text is invalid`);
      else out.text = v;
    }
    if (raw.border !== undefined) {
      const v = color(raw.border, true);
      if (!v) errors.push(`cards.${label}.border is invalid`);
      else out.border = v;
    }
    if (raw.radius !== undefined) {
      const v = radius(raw.radius);
      if (!v) errors.push(`cards.${label}.radius is invalid`);
      else out.radius = v;
    }
    if (raw.shadow !== undefined) {
      const v = shadow(raw.shadow);
      if (!v) errors.push(`cards.${label}.shadow is invalid`);
      else out.shadow = v;
    }
    return Object.keys(out).length ? out : null;
  }

  function normalizeCards(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("cards must be an object");
      return out;
    }
    for (const key of ["standard", "feature"]) {
      const value = normalizeCard(raw[key], key, errors);
      if (value) out[key] = value;
    }
    return out;
  }

  function normalizeFonts(raw, errors) {
    if (raw === undefined) return [];
    if (!Array.isArray(raw)) {
      errors.push("fonts must be an array");
      return [];
    }
    const out = [];
    for (const [i, item] of raw.entries()) {
      const source = typeof item === "string" ? { family: item } : item;
      if (!isObject(source)) {
        errors.push(`fonts[${i}] must be a family name or object`);
        continue;
      }
      const name = family(source.family);
      if (!name) {
        errors.push(`fonts[${i}].family is invalid`);
        continue;
      }
      const role = ["display", "heading", "body", "cta"].includes(source.role) ? source.role : "";
      out.push({ family: name, role });
    }
    return out;
  }

  function normalizeEffects(raw, errors) {
    const out = {};
    if (raw === undefined) return out;
    if (!isObject(raw)) {
      errors.push("effects must be an object");
      return out;
    }
    if (raw.shadow !== undefined) {
      const v = shadow(raw.shadow);
      if (!v) errors.push("effects.shadow is invalid");
      else out.shadow = v;
    }
    if (raw.blur !== undefined) {
      const v = text(raw.blur);
      if (!v || !SAFE.test(v)) errors.push("effects.blur is invalid");
      else out.blur = v;
    }
    return out;
  }

  function normalizeTheme(raw) {
    const errors = [];
    if (!isObject(raw)) {
      return { ok: false, errors: ["Theme must be a JSON object."], theme: null };
    }
    if (Number(raw.themeVersion) !== THEME_VERSION) errors.push("themeVersion must be 1");
    const meta = isObject(raw.meta) ? { ...raw.meta } : {};
    const name = text(meta.name || raw.name);
    if (!name) errors.push("meta.name is required");
    if (!isObject(raw.meta) && raw.meta !== undefined) errors.push("meta must be an object");
    const colors = normalizeColors(raw.colors, errors);
    const typography = normalizeTypography(raw.typography, errors);
    const shape = normalizeShape(raw.shape, errors);
    const spacing = normalizeSpacing(raw.spacing, errors);
    const buttons = normalizeButtons(raw.buttons, errors);
    const cards = normalizeCards(raw.cards, errors);
    const effects = normalizeEffects(raw.effects, errors);
    const fonts = normalizeFonts(raw.fonts, errors);
    if (raw.assets !== undefined && !isObject(raw.assets) && !Array.isArray(raw.assets))
      errors.push("assets must be an object or array");
    if (!Object.keys(colors).length && !Object.keys(typography).length && !Object.keys(buttons).length && !Object.keys(cards).length)
      errors.push("Theme must define at least one of colors, typography, buttons or cards");
    const theme = {
      themeVersion: THEME_VERSION,
      meta: { ...meta, name },
      colors,
      typography,
      shape,
      spacing,
      buttons,
      cards,
      effects,
      fonts,
      assets: raw.assets ?? {},
    };
    return { ok: errors.length === 0, errors, theme };
  }

  function summary(theme) {
    return Object.entries(SECTION_LABELS).map(([key, label]) => ({
      key,
      label,
      present: !!theme && isObject(theme[key]) && Object.keys(theme[key]).length > 0,
    }));
  }

  function withPseudo(selector, pseudo) {
    return selector
      .split(",")
      .map((part) => `${part.trim()}${pseudo}`)
      .join(", ");
  }

  function tokenizeFamily(name) {
    const n = family(name);
    if (!n) return null;
    if (/,/.test(n)) return n;
    return `"${n}", ui-sans-serif, system-ui, sans-serif`;
  }

  function midpoint(a, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return `${round((x + y) / 2)}px`;
  }

  function mapTheme(theme) {
    const empty = {
      v: 2,
      global: {},
      palette: {},
      dark: {},
      light: {},
      shadows: {},
      texts: {},
      fontRules: {},
      scoped: {},
      assets: {},
      pages: {},
    };
    if (!theme) return empty;
    const global = empty.global;
    const light = empty.light;
    const dark = empty.dark;
    const scoped = empty.scoped;
    const fontRules = empty.fontRules;
    const c = theme.colors || {};
    const both = (key, value) => {
      if (value === undefined || value === null || value === "") return;
      light[key] = value;
      dark[key] = value;
    };
    const single = (key, value) => {
      if (value === undefined || value === null || value === "") return;
      global[key] = value;
    };
    const add = (id, sel, prop, value, label) => {
      if (value === undefined || value === null || value === "") return;
      scoped[id] = {
        sel,
        prop,
        value: String(value),
        kind: /color/.test(prop) ? "color" : "value",
        from: "theme",
        label,
      };
    };

    if (c.primary) {
      single("--button-primary", c.primary);
      single("--primary-foreground", c.textOnPrimary || "#ffffff");
      single("--ring", c.primary);
      both("--bg-brand", c.primary);
      both("--bg-info", c.primary);
      both("--border-brand", c.primary);
      both("--border-selected", c.primary);
      both("--bg-brand-accessible", c.primary);
      both("--text-brand", c.primary);
      both("--icon-brand", c.primary);
    }
    if (c.primaryHover) both("--bg-brand-selected", c.primaryHover);
    if (c.primarySubtle) {
      both("--bg-brand-subtle", c.primarySubtle);
      both("--bg-info-subtle", c.primarySubtle);
    }
    if (c.textOnPrimary) both("--text-on-brand", c.textOnPrimary);
    if (c.background) {
      both("--bg-screen", c.background);
      both("--bg-unselected", c.background);
      both("--bg-subtle", c.background);
    }
    if (c.surface) {
      both("--bg-container", c.surface);
      both("--bg-input", c.surface);
      both("--bg-container-translucent", `color-mix(in srgb, ${c.surface} 92%, transparent)`);
    }
    if (c.strongSurface) {
      both("--bg-inverse", c.strongSurface);
      both("--text-inverse", c.textOnStrongSurface || c.textOnPrimary || c.surface || "#ffffff");
    }
    if (c.primaryText) {
      both("--text-primary", c.primaryText);
      both("--icon-primary", c.primaryText);
      single("--secondary-foreground", c.primaryText);
    }
    if (c.secondaryText) {
      both("--text-subtle", c.secondaryText);
      both("--icon-unselected", c.secondaryText);
    }
    if (c.mutedText) {
      both("--text-disabled", c.mutedText);
      both("--icon-disabled", c.mutedText);
      both("--border-disabled", c.mutedText);
    }
    if (c.border) {
      both("--border-subtle", c.border);
      both("--border-unselected", c.border);
      both("--border-divider", c.border);
    }
    if (c.positive) {
      both("--bg-success", c.positive);
      both("--bg-price-up", c.positive);
      both("--text-success", c.positive);
      both("--text-price-up", c.positive);
      both("--text-price-positive", c.positive);
      both("--border-success", c.positive);
      both("--border-price-up", c.positive);
      both("--icon-success", c.positive);
      both("--icon-price-up", c.positive);
    }
    if (c.negative) {
      both("--bg-error", c.negative);
      both("--bg-price-down", c.negative);
      both("--text-error", c.negative);
      both("--text-price-down", c.negative);
      both("--border-error", c.negative);
      both("--icon-error", c.negative);
    }
    if (c.warning) {
      both("--bg-warning", c.warning);
      both("--text-warning", c.warning);
      both("--border-warning", c.warning);
      both("--icon-warning", c.warning);
    }

    const t = theme.typography || {};
    if (t.display && t.display.weight) single("--font-black", String(t.display.weight));
    if (t.heading && t.heading.weight) single("--font-bold", String(t.heading.weight));
    if (t.body && t.body.weight) single("--font-regular", String(t.body.weight));
    if (t.cta && t.cta.weight) single("--font-semibold", String(t.cta.weight));
    for (const role of ["display", "heading", "body", "cta"]) {
      const spec = t[role];
      if (!spec) continue;
      const sel = ROLE_SELECTORS[role];
      const label = role === "cta" ? "CTA type" : `${role[0].toUpperCase() + role.slice(1)} type`;
      if (spec.weight) add(`theme:type:${role}:weight`, sel, "font-weight", spec.weight, label);
      if (spec.lineHeight) add(`theme:type:${role}:line`, sel, "line-height", spec.lineHeight, label);
      if (spec.letterSpacing) add(`theme:type:${role}:tracking`, sel, "letter-spacing", spec.letterSpacing, label);
      if (spec.family) {
        if (role === "body") {
          const stack = tokenizeFamily(spec.family);
          if (stack) single("--font-sans", stack);
        } else {
          fontRules[sel] = family(spec.family);
        }
      }
    }
    for (const font of theme.fonts || []) {
      if (!font.role || !font.family) continue;
      if (font.role === "body") {
        const stack = tokenizeFamily(font.family);
        if (stack) single("--font-sans", stack);
      } else fontRules[ROLE_SELECTORS[font.role]] = font.family;
    }

    const sh = theme.shape || {};
    if (sh.inputRadius) {
      single("--radius", sh.inputRadius);
      single("--radius-md", sh.inputRadius);
    }
    if (sh.cardRadius) single("--radius-lg", sh.cardRadius);
    if (sh.largeCardRadius) single("--radius-xl", sh.largeCardRadius);
    if (sh.buttonRadius) {
      single("--radius-full", sh.buttonRadius);
      add("theme:shape:button", '[data-slot="button"], button, [role="button"]', "border-radius", sh.buttonRadius, "Button");
    }
    if (sh.inputRadius) add("theme:shape:input", INPUT_SELECTOR, "border-radius", sh.inputRadius, "Input");

    const sp = theme.spacing || {};
    const scale = [
      ["--space-xxxs", sp.xs],
      ["--space-xxs", sp.sm],
      ["--space-sm", sp.md],
      ["--space-lg", sp.lg],
      ["--space-xl", sp.xl],
      ["--space-xxl", sp["2xl"]],
      ["--space-xxxl", sp["3xl"]],
    ];
    for (const [key, value] of scale) if (value) single(key, value);
    const gap1 = sp.sm && sp.md ? midpoint(sp.sm, sp.md) : null;
    const gap2 = sp.md && sp.lg ? midpoint(sp.md, sp.lg) : null;
    if (gap1) single("--space-xs", gap1);
    if (gap2) single("--space-md", gap2);
    if (sp.xl) single("--page-gutter", sp.xl);
    if (sp.md) single("--grid-gutter", sp.md);

    const b = theme.buttons || {};
    if (b.primary) {
      const p = b.primary;
      if (p.background && p.background !== "transparent") {
        single("--button-primary", p.background);
        add("theme:button:primary:bg", PRIMARY_BUTTON, "background-color", p.background, "Primary button");
        add("theme:button:primary:image", PRIMARY_BUTTON, "background-image", "none", "Primary button");
      }
      if (p.text) {
        single("--primary-foreground", p.text);
        add("theme:button:primary:text", PRIMARY_BUTTON, "color", p.text, "Primary button");
      }
      if (p.border) add("theme:button:primary:border", PRIMARY_BUTTON, "border-color", p.border, "Primary button");
      if (p.radius) add("theme:button:primary:radius", PRIMARY_BUTTON, "border-radius", p.radius, "Primary button");
      if (p.shadow) add("theme:button:primary:shadow", PRIMARY_BUTTON, "box-shadow", p.shadow, "Primary button");
      if (p.hover) {
        both("--bg-brand-selected", p.hover);
        add("theme:button:primary:hover", withPseudo(PRIMARY_BUTTON, ":hover"), "background-color", p.hover, "Primary button");
      }
    }
    if (b.secondary) {
      const s = b.secondary;
      if (s.background) {
        add("theme:button:secondary:bg", SECONDARY_BUTTON, "background-color", s.background, "Secondary button");
        add("theme:button:secondary:image", SECONDARY_BUTTON, "background-image", "none", "Secondary button");
      }
      if (s.text) add("theme:button:secondary:text", SECONDARY_BUTTON, "color", s.text, "Secondary button");
      if (s.border) {
        add("theme:button:secondary:border", SECONDARY_BUTTON, "border-color", s.border, "Secondary button");
        add("theme:button:secondary:width", SECONDARY_BUTTON, "border-width", "1px", "Secondary button");
        add("theme:button:secondary:style", SECONDARY_BUTTON, "border-style", "solid", "Secondary button");
      }
      if (s.radius) add("theme:button:secondary:radius", SECONDARY_BUTTON, "border-radius", s.radius, "Secondary button");
      if (s.shadow) add("theme:button:secondary:shadow", SECONDARY_BUTTON, "box-shadow", s.shadow, "Secondary button");
      if (s.hover) add("theme:button:secondary:hover", withPseudo(SECONDARY_BUTTON, ":hover"), "background-color", s.hover, "Secondary button");
    }

    const cards = theme.cards || {};
    if (cards.standard) {
      const s = cards.standard;
      if (s.background) add("theme:card:standard:bg", STANDARD_CARD, "background-color", s.background, "Standard card");
      if (s.text) add("theme:card:standard:text", STANDARD_CARD, "color", s.text, "Standard card");
      if (s.border) {
        add("theme:card:standard:border", STANDARD_CARD, "border-color", s.border, "Standard card");
        add("theme:card:standard:width", STANDARD_CARD, "border-width", "1px", "Standard card");
        add("theme:card:standard:style", STANDARD_CARD, "border-style", "solid", "Standard card");
      }
      if (s.radius) add("theme:card:standard:radius", STANDARD_CARD, "border-radius", s.radius, "Standard card");
      if (s.shadow) add("theme:card:standard:shadow", STANDARD_CARD, "box-shadow", s.shadow, "Standard card");
    }
    if (cards.feature) {
      const s = cards.feature;
      if (s.background) {
        add("theme:card:feature:bg", FEATURE_CARD, "background-color", s.background, "Feature card");
        add("theme:card:feature:image", FEATURE_CARD, "background-image", "none", "Feature card");
      }
      if (s.text) add("theme:card:feature:text", FEATURE_CARD, "color", s.text, "Feature card");
      if (s.border) add("theme:card:feature:border", FEATURE_CARD, "border-color", s.border, "Feature card");
      if (s.radius) add("theme:card:feature:radius", FEATURE_CARD, "border-radius", s.radius, "Feature card");
      if (s.shadow) add("theme:card:feature:shadow", FEATURE_CARD, "box-shadow", s.shadow, "Feature card");
    }

    const fx = theme.effects || {};
    if (fx.shadow === "none") {
      for (const name of ["sm", "md", "lg", "xl"])
        empty.shadows[name] = { x: 0, y: 0, blur: 0, spread: 0, color: "#000000", alpha: 0 };
    } else if (fx.shadow) {
      add("theme:effect:shadow", SHADOW_SELECTOR, "box-shadow", fx.shadow, "Shadow");
    }
    if (fx.blur) add("theme:effect:blur", '[class*="backdrop-blur"]', "backdrop-filter", fx.blur, "Blur");

    return empty;
  }

  function parse(input) {
    const result = normalizeTheme(input);
    if (!result.ok) {
      const err = new Error(result.errors[0] || "Invalid theme");
      err.errors = result.errors;
      throw err;
    }
    return { theme: result.theme, summary: summary(result.theme) };
  }

  function validate(input) {
    const result = normalizeTheme(input);
    return {
      ok: result.ok,
      errors: result.errors,
      theme: result.theme,
      summary: result.ok ? summary(result.theme) : [],
    };
  }

  function builtin(id) {
    const raw = BUILTIN[id] || BUILTIN["socios-2026-light"];
    return JSON.parse(JSON.stringify(raw));
  }

  window.SociosThemeSystem = {
    THEME_VERSION,
    SECTION_LABELS,
    builtin,
    builtinIds: Object.keys(BUILTIN),
    mapTheme,
    parse,
    summary,
    validate,
    normalizeTheme,
  };
})();

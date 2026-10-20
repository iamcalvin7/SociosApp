# Socios prototype — local mirror

Offline-capable local mirror of the deployed Socios redesign prototype, plus **Socios Studio**: direct editing on the real page.

## Run

```
npm start                   # serves on http://localhost:3000 (PORT to change)
MIRROR_OFFLINE=1 npm start  # never touches the origin deploy
npm run resync              # re-capture changed pages/chunks from the origin
```

Open **`/__dse/editor`** or click **Edit page** at the bottom-left of the app.

## Socios Studio

Studio replaces the iframe-based editor as the default workflow.

### Versions

- **Original** is always available and read-only.
- Click **Duplicate** to create an editable draft from Original.
- Duplicate an existing draft to branch a design direction.
- Drafts autosave in the browser and can be renamed.
- Switch between Original and drafts from the top floating toolbar.

### Edit the actual page

There is no miniature preview. Studio runs directly on the real Socios page.

1. Duplicate Original.
2. Hover any visible element.
3. Click it.
4. Change the properties in the contextual inspector.

The selected DOM/SVG element is edited with page-scoped overrides, so React/SPA re-renders keep the change without rewriting the captured build.

### What is editable

Studio exposes dedicated controls for common properties and a universal CSS-property fallback.

- **Text:** content, family, weight, size, line height, tracking, alignment, style and colour.
- **Buttons and containers:** colours, borders, radius, opacity, dimensions, spacing and layout.
- **Images:** replace, size, fit, position, radius and opacity.
- **SVG/icons:** fill, stroke, stroke width, opacity and SVG replacement.
- **Charts:** chart SVGs are detected as charts instead of generic icons. Their real series/fill colours are surfaced directly.
- **Layout:** width, height, padding, margin, display, gap, flex direction, justify and alignment.
- **Anything else:** enter any CSS property/value in **Any CSS property**.

**Apply last change to similar** is opt-in rather than automatic.

### Safety and history

- Original is immutable.
- Undo/redo are draft-local.
- **Reset selected** removes overrides for the selected element.
- **Hide** is reversible through undo/reset.
- **Exit** returns to the normal app.
- Existing design-system technology remains underneath Studio, but is no longer part of the normal editing workflow.

### Legacy editor

The previous design-system editor is preserved at **`/__dse/legacy`** for compatibility, theme import/export and advanced token work.

## Legacy editor features\n\n### Portable themes

**+ Upload theme** imports a `.json` design system next to the concept
selector. It validates the portable schema, reads the theme name and shows a
summary of the sections it recognises.

- **Preview** applies the theme to the live app without saving.
- **Cancel** restores the previous concept.
- **Add theme** maps the portable design system onto the existing token and
  scoped-rule engine, creates a new concept, selects it and applies it
  immediately.

The built-in **Socios 2026 Light** theme is available from the concept menu
and goes through the same preview and import flow. Imported themes are normal
concepts afterwards and remain editable with **Select** and **Brand**.

Portable themes never use Socios token names. The portable schema is:

```
{
  "themeVersion": 1,
  "meta": { "name": "My theme" },
  "colors": {},
  "typography": {},
  "spacing": {},
  "shape": {},
  "buttons": {},
  "cards": {},
  "effects": {},
  "fonts": [],
  "assets": {}
}
```

`colors`, `typography`, `buttons` and `cards` are the main design-intent
sections; `shape`, `spacing`, `effects`, `fonts` and `assets` are optional.
The mapper lives in `mirror-overlay/theme-system.js`; users only see the
preview summary and never the token mapping.

### Advanced

**Advanced** opens the raw design-system workbench: token groups, theme
tabs, page scopes, used-on-page filtering, font roles/uploads, asset
library, scoped overrides, token→element highlighting, JSON import/export
and reset-all. It is the same token engine as before; everyday edits do not
need it.

## How it fits together

- `mirror-overlay/editor.html` / `editor.css` / `editor.js` — editor shell,
  simple inspector, brand/concept/export panels and the advanced drawer.
- `mirror-overlay/theme-system.js` — portable theme schema validation,
  preview summary metadata, built-in themes and the theme → Socios token
  mapper.
- `mirror-overlay/apply.js` — injected runtime. Applies token overrides,
  scoped rules, text replacements and asset swaps in the preview; re-applies
  after SPA navigation and re-rendered nodes. Also supports transient theme
  previews that are not persisted.
- `server.mjs` — serves `/__dse/*` and injects the runtime into every HTML
  page. Changes to overlay files are picked up on reload; restart the server
  only after editing `server.mjs`.
- `tools/extract-tokens.mjs` — regenerates `mirror-overlay/design-tokens.json`
  from the build CSS.
- `tools/editor-check.mjs` — headless Chrome end-to-end checks for the simple
  editor, brand panel, concepts, portable theme import, export, persistence
  and advanced drawer.

## Verification

With a server running:

```
npm run check
```

The suite clears the editor's stored concepts/assets in the test browser
before starting, then exercises select → edit → similar → undo/redo, text,
card, image, icon, compare, brand, auto-save, reload persistence, concept
management, theme upload/preview/cancel/add, imported-theme editing and the
advanced drawer.

## Storage

Editor state is local to the browser profile:

- `dse.tokens.v1` — current tokens, scoped overrides, texts, fonts, assets
  and per-page scopes.
- `dse.themes.v1` — saved concepts, including imported portable theme sources.
- `dse.assets.library.v1` — uploaded asset library.
- `dse.active.concept.v1` — last active concept.
- `dse.preview.state.v1`, `dse.preview.width.v1` — preview auth state and
  width.

Uploaded font files live server-side in `mirror-overlay/fonts/`.


## Studio files

- `mirror-overlay/studio.js` — live page selection, drafts, inspector, charts, assets and undo/redo.
- `mirror-overlay/studio.css` — floating toolbar, inspector and selection UI.
- `mirror-overlay/editor.html` — lightweight entry point that opens Studio on the actual app.
- `mirror-overlay/legacy.html` — preserved previous editor.
- `mirror-overlay/apply.js` — low-level override runtime used by both Studio and the legacy editor.
- `server.mjs` — injects Studio/runtime resources into mirrored pages.

## Verification

With the local service running:

```
npm run check
```

This runs both the preserved legacy-editor checks and the new Socios Studio checks.

## Studio storage

- `dse.studio.drafts.v1` — Studio drafts.
- `dse.studio.activeDraft.v1` — last selected Studio version.
- Existing `dse.*` keys remain for the legacy editor and low-level runtime.

Uploaded font files remain server-side in `mirror-overlay/fonts/`.

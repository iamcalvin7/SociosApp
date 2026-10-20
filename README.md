# Socios prototype — local mirror

Offline-capable local mirror of the deployed Socios redesign prototype, plus a
click-to-edit visual editor for changing the live app without exposing CSS,
tokens or selectors.

## Run

```
npm start                   # serves on http://localhost:3000 (PORT to change)
MIRROR_OFFLINE=1 npm start  # never touches the origin deploy
npm run resync              # re-capture changed pages/chunks from the origin
```

Open **`/__dse/editor`** (e.g. `http://localhost:3000/__dse/editor`), or click
the **Design editor** pill injected at the bottom-left of every served page.

## Visual editor

The editor is a small rail next to a live preview of the app.

### Edit one thing

1. Click **Select**.
2. Click any object in the preview: a button, text, image, icon, card,
   input or page background.
3. Change it with plain-language controls: colour, size, weight, spacing,
   corner radius, wording, image, alignment and so on.

The inspector only shows controls that make sense for the selected object.
`Esc` closes it. Hovering the preview highlights the clickable target.

**Apply to similar** repeats the change on matching objects (for example
every primary button). It is offered only when the change is safe to repeat.

**Reset** in the inspector removes every edit made to that object.

### Brand

**Brand** edits the whole app at once: primary and secondary colour,
background, card colour, main text, font and corner roundness. Changing the
primary colour also derives pressed, accessible, subtle and text-on-brand
tints so copy stays legible.

### Concepts

A concept is a saved direction. The dropdown at the top switches between
saved concepts; **…** creates, duplicates, renames and deletes them. Changes
save automatically (`Saving… → Saved`) and the active concept is restored on
reload.

### Compare, undo and handoff

- **Original / Edited** (or hold `C`) temporarily hides all edits.
- Undo and redo support the buttons and `Cmd/Ctrl+Z` / `Shift+Cmd/Ctrl+Z`.
- **Export** produces a human-readable list of changes grouped by object,
  plus developer details behind a disclosure. Copy it, download the concept
  as JSON, or download the uploaded assets.

### Portable themes

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

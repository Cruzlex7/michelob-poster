# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Good Pace Posters** — Interactive kiosk prototype for Michelob Ultra's running event at Corferias, Bogotá (July 23–25, 2026). A runner enters their name and reason for running; the app selects a motivational message and generates a letter-size poster for printing.

## How to run

No build step, no dependencies to install. The app runs entirely in the browser using React 18 + Babel loaded from CDN:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open `index.html`. For quick iteration, just open the file directly in the browser — Babel transpiles JSX at runtime.

---

## Architecture

The entire app lives in three files. Load order matters: `tweaks-panel.jsx` must load before `app.jsx` because it registers globals on `window`.

### `tweaks-panel.jsx`
Self-contained debug/tweak panel used by Claude Design. It:
- Exports these globals onto `window`: `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakRow`, `TweakSlider`, `TweakToggle`, `TweakRadio`, `TweakSelect`, `TweakText`, `TweakNumber`, `TweakColor`, `TweakButton`
- Communicates with the Claude Design host via `window.parent.postMessage` using message types: `__edit_mode_available`, `__activate_edit_mode`, `__deactivate_edit_mode`, `__edit_mode_set_keys`, `__edit_mode_dismissed`
- The `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers in `app.jsx` around the `DEFAULTS` object are what the host rewrites when a tweak is saved — **don't remove or reformat those markers**

### `app.jsx`
All product logic. Declares `/* global ... */` at line 1 to consume the `tweaks-panel.jsx` globals without bundler imports.

#### Screen state machine
`App` holds a `screen` string. The linear flow is:

```
attractor → welcome → name → reason → generating → poster → printing → done
                                                                          ↓
                                                                      (reset → attractor)
```

`welcome` auto-advances after 2400ms. `done` auto-resets after 8s countdown. All other transitions are explicit user actions. The kiosk scales to fill any viewport by computing `Math.min(sw/720, sh/1280)` and applying it as a CSS `scale()` transform on `.kiosk-stage`.

#### Message system
`MESSAGES` has three pools (`resistencia`, `proposito`, `celebracion`), each with 5 strings. Template token is `[N]` — replaced with the runner's first name (`.split(' ')[0]`).

For preset reason chips, the category is pre-assigned via `REASONS[].cat`. For custom free-text, `categorize()` runs regex matching; if no keyword matches, it falls back to a random category.

To expand the message bank: add strings to the arrays in `MESSAGES`. To add a preset reason: add an object to `REASONS` with `{ id, label, icon, cat }` — `cat` must be one of the three existing keys.

#### Keyboard component
`<Keyboard>` is an on-screen touch keyboard. It enforces a 22-character max and auto-capitalizes first letter of each word using a Unicode-aware regex. The `⌫` key trims the last character; `␣` appends a space.

### `styles.css`
CSS custom properties at `:root` define the full brand palette. The `--red` variable is overridden at runtime by the `accent` tweak via `document.documentElement.style.setProperty`. When editing styles, use the existing variables — avoid hardcoding the hex values.

The kiosk canvas is always `720×1280px` (`.kiosk-screen`); everything inside sizes relative to that. The `.env` wrapper and `.kiosk-frame` are purely decorative chrome that can be hidden via the `showChrome` tweak.

---

## Reference assets

`good pece post/uploads/` contains the original design brief images and the PDF proposal — useful for visual reference when adjusting the poster layout or brand colors.

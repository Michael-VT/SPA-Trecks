# Technology Stack

**Analysis Date:** 2026-05-15

## Languages

**Primary:**
- JavaScript (ES2022+) - All application code; uses ES modules (`import`/`export`), top-level `await`, template literals, optional chaining, nullish coalescing

**Secondary:**
- HTML5 - Single-page shell in `index.html`
- CSS3 - Inline styles in `index.html` (no external stylesheet; `style.css` exists but is empty)

## Runtime

**Environment:**
- Browser-only (no Node.js, no server-side runtime)
- Requires ES module support (`<script type="module">`)
- Requires `requestAnimationFrame` for playback loop
- No build step, no transpilation — raw ES modules served directly

**Package Manager:**
- None — no `package.json`, no lockfile
- All dependencies loaded via CDN (`unpkg.com`, `cdn.jsdelivr.net`)

## Frameworks

**Core:**
- Leaflet 1.9.4 — Interactive map rendering, tile layers, polylines, markers, circle markers
  - Loaded via `<script>` tag from `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
  - CSS from `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Chart.js (latest via CDN) — Multi-dataset line charts for speed/elevation/heart rate
  - Loaded from `https://cdn.jsdelivr.net/npm/chart.js`

**Touch/Gestures:**
- Hammer.js (latest via CDN) — Touch gesture recognition (swipe, press, double-tap)
  - Loaded from `https://cdn.jsdelivr.net/npm/hammerjs`

**Screen Capture:**
- html2canvas 1.4.1 — Screenshot export of the full page
  - Loaded from `https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js`

**Testing:**
- None — no test framework, no test files

**Build/Dev:**
- None — no bundler, no transpiler, no dev server configuration

## Key Dependencies

**Critical (CDN-loaded, no local install):**

| Library | Version | Purpose | Loading Method |
|---------|---------|---------|----------------|
| Leaflet | 1.9.4 | Map rendering, tile layers, polylines, markers | `<script>` global (`L`) |
| Chart.js | latest | Speed/elevation/HR line chart | `<script>` global (`Chart`) |
| Hammer.js | latest | Mobile touch gestures (swipe/press/tap) | `<script>` global (`Hammer`) |
| html2canvas | 1.4.1 | DOM-to-canvas screenshot export | `<script>` global (`html2canvas`) |

**Local Vendored Libraries (empty stubs):**
- `libs/hammer.min.js` — 0 bytes (empty file; actual library loaded via CDN)
- `libs/chart.min.js` — 0 bytes (empty file; actual library loaded via CDN)

**Infrastructure:**
- No server-side dependencies
- No database driver
- No ORM
- No authentication library

## Configuration

**Environment:**
- No environment variables
- No `.env` files
- No configuration files
- All settings are hardcoded in `app.js` (map center `[39.36, -9.37]`, zoom level `13`, playback speed `1`)
- Track file paths hardcoded in `app.js`:
  ```
  'tracks/route1.gpx'
  'tracks/route2.tcx'
  'tracks/route3.kml'
  ```

**Build:**
- No build configuration files
- No `tsconfig.json`, `vite.config.*`, `webpack.config.*`
- No `.eslintrc`, `.prettierrc`, or any linting/formatting config

**Module System:**
- ES modules via native browser `import`/`export`
- All imports use relative paths: `'./modules/parser.js'`, `'./modules/renderer.js'`, etc.
- CDN libraries exposed as globals (`L`, `Chart`, `Hammer`, `html2canvas`) — not imported as modules

## Platform Requirements

**Development:**
- Any static file server (e.g., `python3 -m http.server`, `npx serve`, VS Code Live Server)
- Cannot run from `file://` protocol due to ES module CORS restrictions
- Modern browser with ES module support (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)
- No Docker, no Node.js, no build toolchain required

**Production:**
- Any static hosting (GitHub Pages, Netlify, Vercel, S3, Nginx)
- No server-side processing
- CDN dependencies require internet connectivity (no offline support)
- No service worker, no PWA manifest

---

*Stack analysis: 2026-05-15*
*Update after major dependency changes*

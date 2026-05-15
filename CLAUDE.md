<!-- GSD:project-start source:PROJECT.md -->
## Project

**SPA-Trecks — Offline GPS Track Analyzer**

Browser-based GPS track visualization and analysis tool. Loads GPX, TCX, and KML files, renders color-coded routes on a Leaflet map (colored by speed, elevation, or heart rate), provides synchronized Chart.js graphs, animated playback with real-time telemetry HUD, and exports session data. Fully offline — runs from any static file server on macOS or Android Termux.

**Core Value:** Color-coded route visualization with synchronized chart/map playback — the user must see their track colored by speed/elevation/HR and scrub through it interactively.

### Constraints

- **Tech stack**: Vanilla JS (ES2022+ modules), Leaflet, Chart.js, Hammer.js — no build step, no npm
- **Offline**: Must work without internet after initial CDN load (CDN libs are the only network dependency)
- **Mobile**: Must work on Android Termux browser with touch gestures
- **No dependencies on Node.js**: Pure browser-side, served by any static file server
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- JavaScript (ES2022+) - All application code; uses ES modules (`import`/`export`), top-level `await`, template literals, optional chaining, nullish coalescing
- HTML5 - Single-page shell in `index.html`
- CSS3 - Inline styles in `index.html` (no external stylesheet; `style.css` exists but is empty)
## Runtime
- Browser-only (no Node.js, no server-side runtime)
- Requires ES module support (`<script type="module">`)
- Requires `requestAnimationFrame` for playback loop
- No build step, no transpilation — raw ES modules served directly
- None — no `package.json`, no lockfile
- All dependencies loaded via CDN (`unpkg.com`, `cdn.jsdelivr.net`)
## Frameworks
- Leaflet 1.9.4 — Interactive map rendering, tile layers, polylines, markers, circle markers
- Chart.js (latest via CDN) — Multi-dataset line charts for speed/elevation/heart rate
- Hammer.js (latest via CDN) — Touch gesture recognition (swipe, press, double-tap)
- html2canvas 1.4.1 — Screenshot export of the full page
- None — no test framework, no test files
- None — no bundler, no transpiler, no dev server configuration
## Key Dependencies
| Library | Version | Purpose | Loading Method |
|---------|---------|---------|----------------|
| Leaflet | 1.9.4 | Map rendering, tile layers, polylines, markers | `<script>` global (`L`) |
| Chart.js | latest | Speed/elevation/HR line chart | `<script>` global (`Chart`) |
| Hammer.js | latest | Mobile touch gestures (swipe/press/tap) | `<script>` global (`Hammer`) |
| html2canvas | 1.4.1 | DOM-to-canvas screenshot export | `<script>` global (`html2canvas`) |
- `libs/hammer.min.js` — 0 bytes (empty file; actual library loaded via CDN)
- `libs/chart.min.js` — 0 bytes (empty file; actual library loaded via CDN)
- No server-side dependencies
- No database driver
- No ORM
- No authentication library
## Configuration
- No environment variables
- No `.env` files
- No configuration files
- All settings are hardcoded in `app.js` (map center `[39.36, -9.37]`, zoom level `13`, playback speed `1`)
- Track file paths hardcoded in `app.js`:
- No build configuration files
- No `tsconfig.json`, `vite.config.*`, `webpack.config.*`
- No `.eslintrc`, `.prettierrc`, or any linting/formatting config
- ES modules via native browser `import`/`export`
- All imports use relative paths: `'./modules/parser.js'`, `'./modules/renderer.js'`, etc.
- CDN libraries exposed as globals (`L`, `Chart`, `Hammer`, `html2canvas`) — not imported as modules
## Platform Requirements
- Any static file server (e.g., `python3 -m http.server`, `npx serve`, VS Code Live Server)
- Cannot run from `file://` protocol due to ES module CORS restrictions
- Modern browser with ES module support (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)
- No Docker, no Node.js, no build toolchain required
- Any static hosting (GitHub Pages, Netlify, Vercel, S3, Nginx)
- No server-side processing
- CDN dependencies require internet connectivity (no offline support)
- No service worker, no PWA manifest
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

# SPA-Trecks — Offline GPS Track Analyzer

## What This Is

Browser-based GPS track visualization and analysis tool. Loads GPX, TCX, and KML files, renders color-coded routes on a Leaflet map (colored by speed, elevation, or heart rate), provides synchronized Chart.js graphs, animated playback with real-time telemetry HUD, and exports session data. Fully offline — runs from any static file server on macOS or Android Termux.

## Core Value

Color-coded route visualization with synchronized chart/map playback — the user must see their track colored by speed/elevation/HR and scrub through it interactively.

## Requirements

### Validated

- ✓ Load GPX/TCX/KML track files — existing parser
- ✓ Color-coded route rendering (speed/height/pulse modes) — existing renderer
- ✓ Leaflet map with OpenStreetMap tiles — existing
- ✓ Playback animation with marker — existing playback engine
- ✓ Synchronized Chart.js panel (speed/elevation/HR) — existing charts
- ✓ Real-time HUD (speed, HR, elevation, time) — existing
- ✓ Altitude drift correction — existing drift.js
- ✓ CSV/JSON/GPX export — existing export.js
- ✓ Mobile touch gestures via Hammer.js — existing mobile.js
- ✓ Keyboard control layer — existing ui.js
- ✓ Tooltip on 2-second hover with point details — existing renderer.js
- ✓ Statistics table overlay (T key) — existing statistics.js

### Active

- [ ] FIT file format support (Huawei/Garmin/Polar native format)
- [ ] Heart rate data integration (requires FIT or extended GPX exports)
- [ ] Canvas/WebGL performance optimization for long tracks
- [ ] Route comparison (overlay multiple sessions)
- [ ] Elevation profile with gradient analysis
- [ ] Training zones (HR zones, pace zones)

### Out of Scope

- Server-side processing — fully client-side, no backend
- User authentication — single-user offline tool
- Real-time GPS tracking — analyzes recorded tracks only
- Social features — no sharing, no accounts
- PWA/service worker — deferred, not critical for core use case

## Context

- **Origin**: User's existing codebase with working modules but several bugs (incorrect color gradients, wrong total distance from flattening 3 files of same route, chart crash on load, duplicate event handlers)
- **Data source**: Huawei Watch GT 3 Pro (ODN-B19) exports via Huawei Health app — GPX/TCX/KML formats. Three files all represent the same route (6682 points, ~9.66km, ~1h52m running). No HR data in current exports (Huawei Health omits HR from GPX/TCX/KML).
- **Altitude drift**: Barometric drift of ~13.7m over 2 hours (start 49.1m, end 35.4m despite returning to same point). Corrected by drift.js.
- **Target platforms**: macOS Safari/Chrome, Android Termux with `python3 -m http.server`
- **Performance**: 6682 track points per route. Per-segment polylines (old approach) caused lag. Now uses L.canvas() with 32 color buckets.

## Constraints

- **Tech stack**: Vanilla JS (ES2022+ modules), Leaflet, Chart.js, Hammer.js — no build step, no npm
- **Offline**: Must work without internet after initial CDN load (CDN libs are the only network dependency)
- **Mobile**: Must work on Android Termux browser with touch gestures
- **No dependencies on Node.js**: Pure browser-side, served by any static file server

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Modular ES modules (no bundler) | Simplicity, works with `python3 -m http.server`, no build step | — Pending |
| L.canvas() renderer with color buckets | Per-segment polylines (6681 objects) caused performance issues; canvas renderer + 32 buckets = ~100 polylines | — Pending |
| Pick longest track as primary | All 3 files are same route; flattening triples distance | — Pending |
| HSL color gradient (120°→0°) | Clean green→yellow→red for speed; more physically intuitive than RGB interpolation | — Pending |
| Hammer.js for mobile gestures | Lightweight, proven library already loaded via CDN | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-15 after initialization*

# Phase 1: Verify & Polish Core - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify all 27 v1 requirements work correctly end-to-end on macOS Safari/Chrome and Android Termux browser. Fix bugs found during verification. Clean up dead code (empty libs/, empty README). This is NOT a feature phase — it's a quality gate confirming the existing codebase meets its requirements.

</domain>

<decisions>
## Implementation Decisions

### Device Testing
- **D-01:** Manual testing — no automated test framework (project has no npm/Node.js)
- **D-02:** Test on both macOS (Safari/Chrome) and Android Termux — set up SSH-accessible Termux for CI-like mobile verification
- **D-03:** Full checklist covering all 27 requirements + edge cases (empty files, broken XML, no CDN network)
- **D-04:** Checklist documented in markdown within the phase, not a separate test framework

### Playback UX
- **D-05:** Fast preview playback — ~2 minutes for entire 6682-point track (speed=1 advances 1 point per rAF at 60fps)
- **D-06:** Speed adjustable via keyboard (current design keeps this)
- **D-07:** Smooth scrubber — dragging on chart moves marker continuously (current behavior)

### Color & Visual
- **D-08:** Speed gradient: green→red via HSL 120°→0° (standard sports app convention like Strava/Garmin)
- **D-09:** Height gradient: green→brown (same HSL approach but different hue range)
- **D-10:** Tooltip appears after 2-second hover — confirmed correct delay

### Architecture Cleanup
- **D-11:** Delete empty `libs/` directory (hammer.min.js, chart.min.js = 0 bytes, CDN is the source)
- **D-12:** Delete empty `README.md` (0 bytes)
- **D-13:** No other cleanup — modular architecture is clean, no duplicate code remains

### Claude's Discretion
- Exact edge cases to test (beyond the 27 requirements) — Claude decides based on domain knowledge
- Specific fixes if bugs are found — Claude has full discretion to fix as needed
- Test checklist format and detail level

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project scope, constraints, key decisions
- `.planning/REQUIREMENTS.md` — All 27 v1 requirements with REQ-IDs and traceability
- `.planning/ROADMAP.md` — Phase 1 definition, success criteria, requirement mapping

### Codebase
- `.planning/codebase/STACK.md` — Tech stack (vanilla JS, Leaflet, Chart.js, Hammer.js)
- `.planning/codebase/INTEGRATIONS.md` — External services (OSM tiles, CDN libs), file format schemas

### Source Files (all modules)
- `modules/parser.js` — GPX/TCX/KML parser with speed/distance computation
- `modules/renderer.js` — Color heatmap, marker, legend, tooltip (2s delay)
- `modules/statistics.js` — Stats calculation + overlay table
- `modules/charts.js` — Chart.js synced panel with scrubber
- `modules/playback.js` — Play/pause/seek engine
- `modules/drift.js` — Altitude smoothing + drift correction
- `modules/export.js` — CSV/JSON/GPX download
- `modules/mobile.js` — Hammer.js gestures
- `modules/ui.js` — Keyboard + button control
- `app.js` — Orchestrator wiring all modules
- `index.html` — HTML shell
- `style.css` — All styles

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- All 9 modules written with clean exports/imports — fully functional
- Parser handles Huawei KML (Placemark/Point/coordinates/TimeSpan) — non-standard format
- Renderer uses L.canvas() with 32 color buckets — performant for 6682 points
- Drift correction smooths ±5 point window, linearly corrects start/end drift (13.7m for this route)

### Established Patterns
- ES module imports — no bundler, works with `python3 -m http.server`
- CDN globals (L, Chart, Hammer) — not imported as modules
- Event-driven sync: bindChartToMap callback chain connects chart→map→HUD
- Playback engine: requestAnimationFrame loop, advance by `speed` points per frame

### Integration Points
- `app.js` is the single orchestrator — all wiring happens there
- New features add modules and wire in app.js
- Track data flows: parser → enrich (speed/distance) → drift correction → render/chart/stats

</code_context>

<specifics>
## Specific Ideas

- Edge case testing: empty GPX, TCX with no Position elements, KML with missing TimeSpan, zero-byte files
- Verify KML parser correctly skips Start/End marker Placemarks (no TimeSpan = no data point)
- Confirm distance calculation: ~9.66km for the route (from GPX metadata), NOT 29km (3x from concatenation)
- Confirm altitude: start ~49m, end ~49m after drift correction (not 35.4m raw)

</specifics>

<deferred>
## Deferred Ideas

- **File box UI** — draggable/droppable area where user adds track files and selects which to display. New capability, belongs in Phase 2 or later. Enables: loading arbitrary tracks without editing app.js, toggling track visibility, comparing multiple routes.
- FIT file support — deferred to Phase 2 per ROADMAP.md
- WebGL rendering — deferred to Phase 3 per ROADMAP.md
- Route comparison overlay — deferred to Phase 2 per ROADMAP.md

</deferred>

---

*Phase: 1-Verify & Polish Core*
*Context gathered: 2026-05-15*

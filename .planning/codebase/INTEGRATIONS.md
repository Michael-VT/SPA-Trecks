# External Integrations

**Analysis Date:** 2026-05-15

## APIs & External Services

**Map Tiles:**
- OpenStreetMap — Raster tile layer for map rendering
  - SDK/Client: Leaflet's `L.tileLayer()` in `app.js`
  - Auth: None (public tile server)
  - Endpoint: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Usage policy: OSM Tile Usage Policy requires reasonable request rates and valid User-Agent

**CDN-hosted Libraries:**
- unpkg.com — Hosts Leaflet 1.9.4 JS + CSS
  - URLs: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`, `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- cdn.jsdelivr.net — Hosts Chart.js, Hammer.js, html2canvas
  - URLs: `https://cdn.jsdelivr.net/npm/chart.js`, `https://cdn.jsdelivr.net/npm/hammerjs`, `https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js`

**External APIs:**
- None — the application has no outbound API calls beyond loading CDN assets and map tiles

## Data Storage

**Databases:**
- None — all data lives in static track files loaded into browser memory

**File Storage:**
- Local filesystem only (static files served by web server)
  - Track files in `tracks/` directory: `route1.gpx` (758 KB), `route2.tcx` (1.4 MB), `route3.kml` (1.6 MB)
  - Loaded via `fetch()` in `modules/parser.js` (currently an empty stub)

**Caching:**
- None — no service worker, no local storage, no IndexedDB, no HTTP cache directives

## Authentication & Identity

**Auth Provider:**
- None — the application is fully client-side with no user accounts or authentication

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None — no error reporting service

**Analytics:**
- None — no analytics tracking

**Logs:**
- Browser console only — `console.log("LONG PRESS", ev)` in `modules/mobile.js` is the only explicit log statement
- No structured logging

## CI/CD & Deployment

**Hosting:**
- Static hosting only — no deployment pipeline configured
- No CI/CD configuration files (no `.github/workflows/`, no `Dockerfile`, no `vercel.json`)
- Served directly from filesystem via any static file server

**CI Pipeline:**
- None

## Environment Configuration

**Development:**
- Required env vars: None
- Secrets location: None
- Any static file server sufficient (e.g., `npx serve`, `python3 -m http.server`)

**Staging:**
- Not applicable

**Production:**
- No environment-specific configuration
- No secrets management — nothing to secure beyond static assets

## Webhooks & Callbacks

**Incoming:**
- None — no server component to receive webhooks

**Outgoing:**
- None — no outbound webhook calls

## File Format Dependencies

The application processes three GPS track formats. Parsing logic is expected in `modules/parser.js` (currently an empty stub):

| Format | File | Size | Standard |
|--------|------|------|----------|
| GPX | `tracks/route1.gpx` | 758 KB | GPS Exchange Format (XML) |
| TCX | `tracks/route2.tcx` | 1.4 MB | Training Center XML (Garmin) |
| KML | `tracks/route3.kml` | 1.6 MB | Keyhole Markup Language (Google Earth) |

**Track data point schema** (inferred from usage across modules):

```javascript
{
  lat: Number,      // Latitude (decimal degrees)
  lon: Number,      // Longitude (decimal degrees)
  ele: Number,      // Elevation (meters, raw)
  eleSmooth: Number, // Smoothed elevation (added by drift.js)
  eleCorrected: Number, // Drift-corrected elevation (added by drift.js)
  speed: Number,    // Speed (km/h, optional)
  hr: Number,       // Heart rate (bpm, optional)
  time: String,     // Timestamp (ISO format, optional)
  distance: Number  // Cumulative distance (optional)
}
```

## Export Integrations

The application generates client-side file downloads with no server round-trip. All exports defined in `modules/export.js`:

| Export | Format | Trigger | Method |
|--------|--------|---------|--------|
| CSV | `text/csv` | Keyboard `x` | `Blob` → `URL.createObjectURL` → `<a>` click |
| JSON | `application/json` | Keyboard `z` | `JSON.stringify` → `Blob` → download |
| GPX | `application/gpx+xml` | Keyboard `g` (in `ui.js`) | XML string → `Blob` → download |
| Screenshot | `image/png` | Keyboard `e` (in `ui.js`) | `html2canvas()` → `canvas.toDataURL()` → download |

---

*Integration audit: 2026-05-15*
*Update when adding/removing external services*

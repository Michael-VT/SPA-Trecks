# Requirements: SPA-Trecks

**Defined:** 2026-05-15
**Core Value:** Color-coded route visualization with synchronized chart/map playback

## v1 Requirements

### Track Loading

- [ ] **LOAD-01**: App loads GPX files (standard trkpt with lat/lon/ele/time)
- [ ] **LOAD-02**: App loads TCX files (Garmin Trackpoint with Position/AltitudeMeters/Time)
- [ ] **LOAD-03**: App loads KML files (Huawei Placemark/Point/coordinates/TimeSpan format)
- [ ] **LOAD-04**: Parser computes speed (km/h) from haversine distance + time deltas
- [ ] **LOAD-05**: Parser computes cumulative distance (meters) along route
- [ ] **LOAD-06**: Multiple files of the same route load as one primary track (not concatenated)

### Route Visualization

- [ ] **VIS-01**: Route drawn on Leaflet map with color gradient by speed (green=slow → red=fast)
- [ ] **VIS-02**: Route colored by elevation (green=low → brown=high)
- [ ] **VIS-03**: Route colored by heart rate (green=low → red=high) when HR data available
- [ ] **VIS-04**: Color legend shows gradient bar with min/max values and units
- [ ] **VIS-05**: Route uses canvas renderer (L.canvas) with batched color buckets for performance
- [ ] **VIS-06**: Map auto-fits bounds to track on load

### Playback

- [ ] **PLAY-01**: Play/pause playback moves marker along route
- [ ] **PLAY-02**: Forward/backward seek skips by 20 points
- [ ] **PLAY-03**: Playback marker visible as distinct circle marker on route
- [ ] **PLAY-04**: Playback syncs with HUD, chart cursor, and map marker

### Charts

- [ ] **CHART-01**: Chart.js panel shows speed, elevation, and HR as overlaid line charts
- [ ] **CHART-02**: Chart panel slides up from bottom (toggle with G key or swipe up)
- [ ] **CHART-03**: Chart cursor syncs with map marker (hover/click on chart moves marker)
- [ ] **CHART-04**: Touch scrub on chart moves marker (mobile)
- [ ] **CHART-05**: Dual Y-axis (speed/HR left, elevation right)

### HUD

- [ ] **HUD-01**: Real-time telemetry shows speed, HR, elevation, time
- [ ] **HUD-02**: HUD updates during playback and scrubbing

### Tooltip

- [ ] **TIP-01**: Hovering over route for 2+ seconds shows tooltip with point details
- [ ] **TIP-02**: Tooltip shows: speed, elevation, HR, time, distance, coordinates

### Statistics

- [ ] **STAT-01**: Statistics table shows total distance, duration, avg/max speed
- [ ] **STAT-02**: Statistics table shows elevation gain/loss, min/max elevation
- [ ] **STAT-03**: Statistics table shows avg/max HR (when available)
- [ ] **STAT-04**: Statistics overlay toggled with T key, dismissible by click or T

### Data Correction

- [ ] **DRIFT-01**: Altitude smoothed with moving average (window ±5 points)
- [ ] **DRIFT-02**: Start/end altitude drift corrected for loop routes

### Export

- [ ] **EXPORT-01**: CSV export with all point data (X key)
- [ ] **EXPORT-02**: JSON export of full track array (Z key)
- [ ] **EXPORT-03**: GPX export with corrected elevation (E key)

### Mobile

- [ ] **MOB-01**: Swipe left/right switches color modes
- [ ] **MOB-02**: Swipe up/down toggles chart panel
- [ ] **MOB-03**: Double tap toggles play/pause
- [ ] **MOB-04**: Responsive layout adapts to mobile screens

## v2 Requirements

### FIT Support

- **FIT-01**: Parse FIT files (Garmin/Huawei/Polar native format)
- **FIT-02**: Extract HR, cadence, power, temperature from FIT records
- **FIT-03**: Support for multiple sessions in single FIT file

### Advanced Analytics

- **ANALYT-01**: Training zones (HR zones 1-5)
- **ANALYT-02**: Pace zones and splits (per-km pace)
- **ANALYT-03**: Elevation profile with grade percentage
- **ANALYT-04**: Route comparison (overlay two tracks)

### Performance

- **PERF-01**: WebGL renderer for tracks >10k points
- **PERF-02**: Web Worker for file parsing
- **PERF-03**: Service worker for offline CDN caching

## Out of Scope

| Feature | Reason |
|---------|--------|
| Server-side processing | Fully client-side, no backend |
| User authentication | Single-user offline tool |
| Real-time GPS tracking | Analyzes recorded tracks only |
| Social features | No sharing, accounts, or leaderboards |
| Build tools / npm | Must work with python3 -m http.server |
| PWA/service worker | Deferred — CDN deps need internet anyway |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOAD-01 through LOAD-06 | Phase 1 | Complete |
| VIS-01 through VIS-06 | Phase 1 | Complete |
| PLAY-01 through PLAY-04 | Phase 1 | Complete |
| CHART-01 through CHART-05 | Phase 1 | Complete |
| HUD-01, HUD-02 | Phase 1 | Complete |
| TIP-01, TIP-02 | Phase 1 | Complete |
| STAT-01 through STAT-04 | Phase 1 | Complete |
| DRIFT-01, DRIFT-02 | Phase 1 | Complete |
| EXPORT-01 through EXPORT-03 | Phase 1 | Complete |
| MOB-01 through MOB-04 | Phase 1 | Complete |
| FIT-01 through FIT-03 | Phase 2 | Pending |
| ANALYT-01 through ANALYT-04 | Phase 2 | Pending |
| PERF-01 through PERF-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-15*
*Last updated: 2026-05-15 after initial definition*

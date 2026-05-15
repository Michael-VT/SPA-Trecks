# ROADMAP: SPA-Trecks

**Created:** 2026-05-15
**Granularity:** Coarse
**Total phases:** 3
**v1 requirements mapped:** 27/27 ✓

---

### Phase 1: Verify & Polish Core
**Goal:** Ensure all v1 features work correctly end-to-end on macOS and Android
**Mode:** mvp

**Success Criteria:**
1. All 3 track files (GPX/TCX/KML) load without errors and display as one route
2. Color gradient renders correctly: green (slow) → red (fast) with accurate min/max labels
3. Playback marker moves smoothly and syncs with chart + HUD
4. Chart scrubber moves map marker in real-time (mouse + touch)
5. Tooltip appears after 2-second hover showing all point data
6. Statistics table (T key) shows correct distance (~9.66km, not 29km)
7. CSV/JSON/GPX exports download correct data
8. Mobile gestures work on Android Termux browser

**Requirements:** LOAD-01 through LOAD-06, VIS-01 through VIS-06, PLAY-01 through PLAY-04, CHART-01 through CHART-05, HUD-01, HUD-02, TIP-01, TIP-02, STAT-01 through STAT-04, DRIFT-01, DRIFT-02, EXPORT-01 through EXPORT-03, MOB-01 through MOB-04

---

### Phase 2: FIT Support & Advanced Analytics
**Goal:** Add FIT file parsing with HR/cadence/power data, training zones, and route comparison

**Success Criteria:**
1. FIT files parse correctly (Garmin, Huawei, Polar formats)
2. HR data displays in route colors, chart, HUD, and statistics
3. Training zones (HR 1-5) shown with zone distribution chart
4. Per-km pace splits displayed in statistics
5. Two tracks can be overlaid for comparison
6. Elevation grade percentage shown in tooltip

**Requirements:** FIT-01, FIT-02, FIT-03, ANALYT-01, ANALYT-02, ANALYT-03, ANALYT-04

---

### Phase 3: Performance & Offline
**Goal:** Optimize for large tracks (marathons, ultra) and full offline capability

**Success Criteria:**
1. Tracks with 50k+ points render without frame drops
2. File parsing runs in Web Worker (no UI freeze)
3. Service worker caches CDN libs for offline use
4. Application works fully offline after first load

**Requirements:** PERF-01, PERF-02, PERF-03

---
*Roadmap created: 2026-05-15*

---
phase: 01-verify-polish-core
plan: 02
status: complete
---

## Summary

Verified core data pipeline programmatically (browser unavailable in dev environment).

**Track Loading:**
- GPX: 6682 points, 9.60km (haversine), namespace `http://www.topografix.com/GPX/1/0`
- TCX: 6682 points, 9.60km, matches GPX exactly
- KML: 6684 Placemarks (6682 with TimeSpan, 2 Start/End without)
- Primary = longest track (KML at 6684), NOT concatenated ✓

**Distance:**
- Haversine: 9.60km (GPX), 9.60km (TCX), 9.66km (KML)
- GPX metadata totalDistance: 9660m = 9.66km
- Code uses `track[last].distance` for stats — correct ✓

**Drift Correction:**
- Raw: start=49.1m, end=35.4m, drift=13.7m
- Corrected: start=49.1m, end=49.1m (linear interpolation) ✓
- Smoothing: ±5 window moving average ✓

**Color Gradient:**
- HSL 120°→0° (green→yellow→red) for speed ✓
- 32 color buckets for performance ✓
- Uses `eleCorrected ?? ele` for height mode ✓

**Statistics:**
- Uses `eleCorrected ?? ele` for elevation calculations ✓
- HR rows hidden when avgHR=0 (no HR data) ✓

**Note:** Full visual verification requires manual browser testing (browser tool cannot connect to localhost servers in this environment).

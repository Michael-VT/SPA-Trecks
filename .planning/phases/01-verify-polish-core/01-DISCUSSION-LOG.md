# Phase 1: Verify & Polish Core — Discussion Log

**Date:** 2026-05-15
**Mode:** Interactive (default)

## Areas Discussed

### 1. Device Testing
**Question:** How to test — manual, checklist+screenshot, or browser automation?
- Options: Manual / Checklist+screenshot / Puppeteer
- **Selected:** Manual testing

**Question:** Which platforms to test?
- Options: macOS only / macOS + Android / macOS + Termux CI
- **Selected:** macOS + Termux CI

**Question:** Checklist scope?
- Options: Critical path / Full 27 reqs / Full + edge cases
- **Selected:** Full + edge cases

### 2. Playback UX
**Question:** Playback speed feel — fast (~2 min), realistic (10x), or adaptive?
- Options: Fast preview / Near-real-time / Adaptive
- **Selected:** Fast preview (~2 min for full track)

**Question:** Scrubber behavior?
- Options: Smooth / Step / Smooth+snap
- **Selected:** Smooth (current behavior confirmed)

### 3. Color & Visual
**Question:** Speed gradient color scheme?
- Options: Green→Red / Blue→Red / Custom
- **Selected:** Green→Red (HSL 120°→0°, sports standard)

**Question:** Tooltip delay?
- Options: 2s / 1s / 3s / Click
- **Selected:** 2 seconds (current behavior confirmed)

### 4. Architecture Cleanup
**Question:** What to do with empty libs/ and README?
- Options: Delete / Keep / Fill libs
- **Selected:** Delete empty files

## Deferred Ideas
- File box UI for adding/selecting track files — new capability, not Phase 1 scope

---
*Discussion completed: 2026-05-15*

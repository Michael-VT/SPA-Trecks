// playback.js — play / pause / seek animation engine
// Enhanced for duration-based playback (5/10/15/30s full-track "winding" per user request)
// + rich progress events for audio (speed, cumulative distance, time)

let track = [], running = false, idx = 0, speed = 4, raf = null, cbs = {};
let durationMode = null;          // null = legacy point-step, number = target seconds for whole track
let durationStartTs = 0;          // performance.now() when play started in duration mode
let totalTrackSeconds = 0;        // computed from timestamps or fallback

export function initPlayback(t, callbacks) {
  track = t || [];
  cbs = callbacks || {};
  idx = 0;
  running = false;
  durationMode = null;
  totalTrackSeconds = computeTrackDuration(track);
}

export function play() {
  if (running || track.length === 0) return;
  running = true;
  if (durationMode) {
    durationStartTs = performance.now();
    stepDuration();
  } else {
    step();
  }
}

export function pause() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
}

export function toggle() { running ? pause() : play(); }
export function isRunning() { return running; }

export function setIndex(i) {
  idx = Math.max(0, Math.min(track.length - 1, i));
  cbs.onMove?.(idx, getProgressInfo());
}

export function getIndex() { return idx; }

export function setSpeed(s) {
  speed = Math.max(0.25, Math.min(50, s));
  if (durationMode) {
    // In duration mode speed is secondary; user can still nudge
  }
}

export function getSpeed() { return speed; }

// === Duration mode (user request: 5/10/15/30 seconds for full track, default 15) ===
export function setDuration(seconds) {
  if (!seconds || seconds <= 0) {
    durationMode = null;
    totalTrackSeconds = computeTrackDuration(track);
    return null;
  }
  durationMode = Math.min(120, Math.max(3, seconds)); // sane bounds
  totalTrackSeconds = computeTrackDuration(track) || durationMode;
  if (running) {
    // restart timing from current position
    durationStartTs = performance.now() - (idx / Math.max(1, track.length - 1)) * (durationMode * 1000);
  }
  return durationMode;
}

export function getDurationMode() { return durationMode; }
export function getTotalTrackSeconds() { return totalTrackSeconds; }

function computeTrackDuration(pts) {
  if (!pts || pts.length < 2) return 0;
  const first = pts[0].time ? Date.parse(pts[0].time) : null;
  const last = pts[pts.length - 1].time ? Date.parse(pts[pts.length - 1].time) : null;
  if (first && last && last > first) {
    return Math.max(1, (last - first) / 1000);
  }
  // Fallback: assume ~1.5s per point average (realistic for the demo tracks)
  return pts.length * 1.5;
}

function getProgressInfo() {
  const p = track[idx] || {};
  // crude cumulative distance if not present (used by audio)
  let cum = p.distance;
  if (cum == null && idx > 0) {
    // very rough fallback
    cum = (idx / track.length) * 5200; // approx for Eiffel
  }
  return {
    speed: p.speed,
    hr: p.hr,
    ele: p.eleCorrected ?? p.ele,
    time: p.time,
    cumulativeKm: cum ? cum / 1000 : 0,
    progress: track.length > 1 ? idx / (track.length - 1) : 0
  };
}

function step() {
  if (!running || idx >= track.length) { running = false; cbs.onEnd?.(); return; }
  cbs.onMove?.(idx, getProgressInfo());
  idx += Math.max(1, Math.round(speed));
  raf = requestAnimationFrame(step);
}

// Duration-based stepping — finishes the track in exactly `durationMode` seconds (real wall time).
// This is pure time-driven playback (no legacy point-step logic).
function stepDuration() {
  if (!running || !durationMode || track.length === 0) {
    running = false;
    cbs.onEnd?.();
    return;
  }

  const elapsed = (performance.now() - durationStartTs) / 1000;
  const progress = Math.min(1, Math.max(0, elapsed / durationMode));

  // Compute exact index from real elapsed time
  idx = Math.min(track.length - 1, Math.floor(progress * (track.length - 1)));

  const info = getProgressInfo();
  cbs.onMove?.(idx, info);

  if (progress >= 1 || idx >= track.length - 1) {
    idx = track.length - 1;
    running = false;
    cbs.onEnd?.();
    return;
  }

  raf = requestAnimationFrame(stepDuration);
}

// Convenience: called by audio and UI
export function getProgress() {
  return getProgressInfo();
}

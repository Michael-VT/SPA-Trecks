// playback.js — play / pause / seek animation engine
let track = [], running = false, idx = 0, speed = 1, raf = null, cbs = {};

export function initPlayback(t, callbacks) { track = t; cbs = callbacks; idx = 0; running = false; }
export function play() { if (running) return; running = true; step(); }
export function pause() { running = false; if (raf) cancelAnimationFrame(raf); }
export function toggle() { running ? pause() : play(); }
export function isRunning() { return running; }
export function setIndex(i) { idx = Math.max(0, Math.min(track.length - 1, i)); cbs.onMove?.(idx); }
export function getIndex() { return idx; }
export function setSpeed(s) { speed = Math.max(0.25, Math.min(50, s)); }
export function getSpeed() { return speed; }

function step() {
    if (!running || idx >= track.length) { running = false; cbs.onEnd?.(); return; }
    cbs.onMove?.(idx);
    idx += Math.max(1, Math.round(speed));
    raf = requestAnimationFrame(step);
}

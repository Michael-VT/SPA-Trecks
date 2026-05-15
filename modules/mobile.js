// mobile.js — Hammer.js touch gestures
export function enableMobileGestures(cfg = {}) {
    if (typeof Hammer === "undefined") return;
    const h = new Hammer(document.body);
    h.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
    h.get("press").set({ time: 500 });
    h.get("tap").set({ taps: 2 });
    h.on("swipeleft", () => cfg.onSwipeLeft?.());
    h.on("swiperight", () => cfg.onSwipeRight?.());
    h.on("swipeup", () => cfg.onSwipeUp?.());
    h.on("swipedown", () => cfg.onSwipeDown?.());
    h.on("press", e => cfg.onLongPress?.(e));
    h.on("doubletap", () => cfg.onDoubleTap?.());
}

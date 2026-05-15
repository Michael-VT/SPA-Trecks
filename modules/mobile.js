export function enableMobileGestures(config = {}) {

    const el = document.body;

    const hammer = new Hammer(el);

    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammer.get('press').set({ time: 500 });

    hammer.get('tap').set({ taps: 2 });

    // -------------------------
    // SWIPE LEFT
    // -------------------------
    hammer.on('swipeleft', () => {

        if (config.onSwipeLeft) {
            config.onSwipeLeft();
        }
    });

    // -------------------------
    // SWIPE RIGHT
    // -------------------------
    hammer.on('swiperight', () => {

        if (config.onSwipeRight) {
            config.onSwipeRight();
        }
    });

    // -------------------------
    // SWIPE UP (chart)
    // -------------------------
    hammer.on('swipeup', () => {

        if (config.onSwipeUp) {
            config.onSwipeUp();
        }
    });

    // -------------------------
    // SWIPE DOWN (hide chart)
    // -------------------------
    hammer.on('swipedown', () => {

        if (config.onSwipeDown) {
            config.onSwipeDown();
        }
    });

    // -------------------------
    // LONG PRESS
    // -------------------------
    hammer.on('press', (ev) => {

        if (config.onLongPress) {
            config.onLongPress(ev);
        }
    });

    // -------------------------
    // DOUBLE TAP
    // -------------------------
    hammer.on('doubletap', () => {

        if (config.onDoubleTap) {
            config.onDoubleTap();
        }
    });
}

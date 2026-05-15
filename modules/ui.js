export const UIState = {
    mode: "view", // view | playback | scrub
    fullscreen: false
};

export function initKeyboard(config) {

    document.addEventListener("keydown", (e) => {

        const k = e.key.toLowerCase();

        // ---------------- VIEW MODES
        if (k === "s") config.onSpeed?.();
        if (k === "h") config.onHeight?.();
        if (k === "p") config.onPulse?.();

        // ---------------- PLAYBACK
        if (k === " ") config.onPlayPause?.();

        if (k === "arrowright") config.onForward?.();
        if (k === "arrowleft") config.onBack?.();

        // ---------------- UI
        if (k === "f") config.onFullscreen?.();

        // ---------------- EXPORT
        if (k === "x") config.onCSV?.();
        if (k === "z") config.onJSON?.();
        if (k === "g") config.onGPX?.();

        if (k === "e") config.onScreenshot?.();
    });
}

export function initButtons(config) {

    document.getElementById("playBtn")
        ?.addEventListener("click", config.onPlayPause);

    document.getElementById("pauseBtn")
        ?.addEventListener("click", config.onPause);

    document.getElementById("chartsBtn")
        ?.addEventListener("click", config.onToggleCharts);
}

export function toggleFullscreen() {

    const el = document.documentElement;

    if (!document.fullscreenElement) {

        el.requestFullscreen?.();
    } else {

        document.exitFullscreen?.();
    }
}

iexport function initUI(config) {

    initKeyboard(config);

    initButtons(config);
}

initUI({

    onSpeed() {
        currentMode = "speed";
        drawTracks(map, tracks, currentMode);
    },

    onHeight() {
        currentMode = "height";
        drawTracks(map, tracks, currentMode);
    },

    onPulse() {
        currentMode = "pulse";
        drawTracks(map, tracks, currentMode);
    },

    onPlayPause() {
        playbackRunning = !playbackRunning;

        if (playbackRunning) playbackStep();
    },

    onForward() {
        playbackIndex += 10;
    },

    onBack() {
        playbackIndex = Math.max(0, playbackIndex - 10);
    },

    onFullscreen() {
        toggleFullscreen();
    },

    onCSV() {
        exportCSV(playbackTrack);
    },

    onJSON() {
        exportJSON(playbackTrack);
    },

    onGPX() {
        exportGPX(playbackTrack);
    },

    onScreenshot() {
        exportScreenshot();
    }
});


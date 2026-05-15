// ui.js — keyboard + button control layer
export function initUI(cfg) {
    document.addEventListener("keydown", e => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        const k = e.key.toLowerCase();
        if (k === "s") cfg.onSpeed?.();
        if (k === "h") cfg.onHeight?.();
        if (k === "p") cfg.onPulse?.();
        if (k === "g") cfg.onCharts?.();
        if (k === "t") cfg.onStats?.();
        if (k === "c") cfg.onDrift?.();
        if (k === " ") { e.preventDefault(); cfg.onPlayPause?.(); }
        if (k === "arrowright") cfg.onForward?.();
        if (k === "arrowleft") cfg.onBack?.();
        if (k === "x") cfg.onCSV?.();
        if (k === "z") cfg.onJSON?.();
        if (k === "e") cfg.onGPX?.();
        if (k === "f") cfg.onFullscreen?.();
    });
    document.getElementById("playBtn")?.addEventListener("click", () => cfg.onPlay?.());
    document.getElementById("pauseBtn")?.addEventListener("click", () => cfg.onPause?.());
    document.getElementById("chartsBtn")?.addEventListener("click", () => cfg.onCharts?.());
}

export function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
}

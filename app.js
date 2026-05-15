// app.js — orchestrator: loads data, wires all modules
import { loadTracks } from "./modules/parser.js";
import { applyDriftCorrection } from "./modules/drift.js";
import { drawTracks, movePlaybackMarker, setupTooltip } from "./modules/renderer.js";
import { createCharts, updateChartCursor, bindChartToMap } from "./modules/charts.js";
import { calculateStatistics, showStatisticsTable, hideStatisticsTable } from "./modules/statistics.js";
import * as pb from "./modules/playback.js";
import { exportCSV, exportJSON, exportGPX } from "./modules/export.js";
import { enableMobileGestures } from "./modules/mobile.js";
import { initUI, toggleFullscreen } from "./modules/ui.js";

// ── Map ──────────────────────────────────────────
const map = L.map("map", { preferCanvas: true }).setView([39.36, -9.37], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

// ── State ────────────────────────────────────────
let tracks = [];
let primary = [];
let currentMode = "speed";
let statsOpen = false;

// ── Load ─────────────────────────────────────────
tracks = await loadTracks([
    "tracks/route1.gpx",
    "tracks/route2.tcx",
    "tracks/route3.kml"
]);

// Pick longest track as primary
primary = tracks.reduce((a, b) => b.length > a.length ? b : a, []);
primary = applyDriftCorrection(primary);

// ── Render ───────────────────────────────────────
drawTracks(map, primary, currentMode);
createCharts(primary);
setupTooltip(map, primary);
map.fitBounds(primary.map(p => [p.lat, p.lon]));

console.log("Stats:", calculateStatistics(primary));

// ── Chart ↔ Map sync ────────────────────────────
bindChartToMap(index => {
    if (index < 0 || index >= primary.length) return;
    pb.setIndex(index);
});

// ── Playback ─────────────────────────────────────
pb.initPlayback(primary, {
    onMove(i) {
        const p = primary[i];
        if (!p) return;
        movePlaybackMarker(map, p);
        updateHUD(p);
        updateChartCursor(i);
    },
    onEnd() {}
});

// ── HUD ──────────────────────────────────────────
function updateHUD(p) {
    const $ = id => document.getElementById(id);
    $("speedLabel").textContent = p.speed != null ? p.speed.toFixed(1) + " km/h" : "—";
    $("hrLabel").textContent = p.hr ?? "—";
    $("eleLabel").textContent = (p.eleCorrected ?? p.ele) != null ? (p.eleCorrected ?? p.ele).toFixed(1) + " m" : "—";
    $("timeLabel").textContent = p.time ? new Date(p.time).toLocaleTimeString() : "—";
}

function setMode(mode) {
    currentMode = mode;
    const names = { speed: "Скорость", height: "Высота", pulse: "Пульс" };
    document.getElementById("modeLabel").textContent = names[mode] || mode;
    drawTracks(map, primary, currentMode);
}

function toggleCharts() {
    document.getElementById("chartContainer").classList.toggle("visible");
    document.body.classList.toggle("chart-open");
}

// ── Keyboard + Buttons ───────────────────────────
initUI({
    onSpeed: () => setMode("speed"),
    onHeight: () => setMode("height"),
    onPulse: () => setMode("pulse"),
    onPlayPause: () => pb.toggle(),
    onPlay: () => pb.play(),
    onPause: () => pb.pause(),
    onForward: () => pb.setIndex(pb.getIndex() + 20),
    onBack: () => pb.setIndex(Math.max(0, pb.getIndex() - 20)),
    onCharts: toggleCharts,
    onStats: () => { statsOpen ? hideStatisticsTable() : showStatisticsTable(primary); statsOpen = !statsOpen; },
    onDrift: () => { /* already applied */ },
    onCSV: () => exportCSV(primary),
    onJSON: () => exportJSON(primary),
    onGPX: () => exportGPX(primary),
    onFullscreen: () => toggleFullscreen()
});

// ── Mobile gestures ──────────────────────────────
enableMobileGestures({
    onSwipeLeft: () => setMode("speed"),
    onSwipeRight: () => setMode("height"),
    onSwipeUp: toggleCharts,
    onSwipeDown: () => { document.getElementById("chartContainer").classList.remove("visible"); document.body.classList.remove("chart-open"); },
    onDoubleTap: () => pb.toggle(),
    onLongPress: ev => console.log("Long press", ev.center)
});

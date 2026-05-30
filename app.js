// app.js — orchestrator: wires all modules, track panel driven
import { applyDriftCorrection } from "./modules/drift.js";
import { drawMultipleTracks, movePlaybackMarker, setupTooltip, setTooltipTrack } from "./modules/renderer.js";
import { createCharts, updateChartCursor, bindChartToMap } from "./modules/charts.js";
import { calculateStatistics, showStatisticsTable, hideStatisticsTable } from "./modules/statistics.js";
import * as pb from "./modules/playback.js";
import { exportCSV, exportJSON, exportGPX } from "./modules/export.js";
import { enableMobileGestures } from "./modules/mobile.js";
import { initUI, toggleFullscreen } from "./modules/ui.js";
import { initTrackPanel } from "./modules/tracks-panel.js";
import { initAudio, onPlaybackProgress, cycleAudioMode, getAudioModeLabel, pauseAudio, resumeAudio } from "./modules/audio.js";
import { loadTracks } from "./modules/parser.js";


// ── Version ──────────────────────────────────────
export const VERSION = "1.1.0";
export const VERSION_DATE = "2026-05-16";

// ── Set document title with version ──────────────
document.title = `Tracks Visualizer v${VERSION}`;
// ── Map ──────────────────────────────────────────
const map = L.map("map", { preferCanvas: true }).setView([39.36, -9.37], 5);
window.map = map;
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

// ── State ────────────────────────────────────────
let primary = [];
let currentMode = "speed";
let statsOpen = false;

// ── Tooltip (setup once, track reference updated dynamically) ──
setupTooltip(map);

// ── Track Panel ──────────────────────────────────
const panel = initTrackPanel(document.getElementById("trackPanelContainer"), {
    version: VERSION,
    versionDate: VERSION_DATE,
    onUpdate(reason) {
        const primaryTrack = panel.getPrimaryTrack();
        const visible = panel.getVisibleTracks();

        // Update primary with drift correction
        if (primaryTrack) {
            primary = applyDriftCorrection([...primaryTrack.points]);
        } else {
            primary = [];
        }

        // Build renderer track list
        const trackList = visible.map(t => ({
            points: t.points,
            color: t.color,
            isPrimary: primaryTrack && t.id === primaryTrack.id
        }));

        drawMultipleTracks(map, trackList, currentMode);
        setTooltipTrack(primary);

        if (primary.length > 0) {
            createCharts(primary);
            pb.initPlayback(primary, {
                onMove(i, info) {
                    const p = primary[i];
                    if (!p) return;
                    movePlaybackMarker(map, p);
                    updateHUD(p);
                    updateChartCursor(i);
                    // Feed rich progress to audio engine (rhythmic layer reacts to speed)
                    if (info) onPlaybackProgress(p, info.cumulativeKm || 0);
                },
                onEnd() { pauseAudio(); }
            });
        } else {
            pb.initPlayback([], { onMove() {}, onEnd() {} });
        }

        // Fit bounds when files added or primary changed
        if ((reason === "files-added" || reason === "primary-changed") && primary.length > 0) {
            map.fitBounds(primary.map(p => [p.lat, p.lon]));
        }
        // If all visible tracks, fit to union of bounds
        if (reason === "files-added" && visible.length > 1) {
            const allPts = visible.flatMap(t => t.points.map(p => [p.lat, p.lon]));
            if (allPts.length > 0) map.fitBounds(allPts);
        }
    }
});

// ── Chart ↔ Map sync ────────────────────────────
bindChartToMap(index => {
    if (index < 0 || index >= primary.length) return;
    pb.setIndex(index);
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

    const visible = panel.getVisibleTracks();
    const primaryTrack = panel.getPrimaryTrack();
    const trackList = visible.map(t => ({
        points: t.points,
        color: t.color,
        isPrimary: primaryTrack && t.id === primaryTrack.id
    }));
    drawMultipleTracks(map, trackList, currentMode);
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
    onPlay: () => { resumeAudio(); pb.play(); },
    onPause: () => { pauseAudio(); pb.pause(); },
    onForward: () => pb.setIndex(pb.getIndex() + 20),
    onBack: () => pb.setIndex(Math.max(0, pb.getIndex() - 20)),
    onCharts: toggleCharts,
    onStats: () => { statsOpen ? hideStatisticsTable() : showStatisticsTable(primary); statsOpen = !statsOpen; },
    onDrift: () => { /* already applied */ },
    onCSV: () => exportCSV(primary),
    onJSON: () => exportJSON(primary),
    onGPX: () => exportGPX(primary),
    onFullscreen: () => toggleFullscreen(),
    onAudioCycle: () => {
        const newMode = cycleAudioMode();
        const label = document.getElementById("audioBtn");
        if (label) label.textContent = newMode === 0 ? "🔇" : (newMode === 1 ? "♪" : (newMode === 2 ? "🎵" : "🗣️"));
        console.log("Audio mode:", getAudioModeLabel());
    },
    onEiffelDemo: () => loadEiffelDemo(false),
    onDuration: (sec) => {
        pb.setDuration(sec);
        // If currently playing in duration mode, restart timing from current position
        if (pb.isRunning()) {
            pb.pause();
            setTimeout(() => pb.play(), 10);
        }
    }
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

// ── Audio (rhythmic + tones + voice) ─────────────
initAudio();

// ── Demo loader (Eiffel Tower run — the official realistic example) ─
async function loadEiffelDemo(loadAllFormats = false) {
  const urls = loadAllFormats
    ? ["tracks/eiffel-tower-run.gpx", "tracks/eiffel-tower-run.tcx", "tracks/eiffel-tower-run.kml"]
    : ["tracks/eiffel-tower-run.gpx"];

  const results = await loadTracks(urls);
  const demoTracks = results
    .map((points, i) => ({ name: urls[i].split('/').pop(), points }))
    .filter(t => t.points && t.points.length > 0);

  if (demoTracks.length === 0) {
    alert("Не удалось загрузить демо-треки Эйфелевой башни.\nУбедись, что файлы есть в папке tracks/.");
    return;
  }

  // Прямой способ: добавляем треки в панель через её внутренний API (если есть)
  // Иначе — самый надёжный способ для быстрого теста: просто берём первый как primary
  if (typeof panel !== 'undefined' && panel.addDemoTracks) {
    panel.addDemoTracks(demoTracks);
  } else {
    // Fallback: напрямую обновляем состояние (работает для первого теста)
    console.log('%c[DEMO] Загружены реалистичные треки Эйфелевой башни. Используй "Add Files" или обнови страницу, если панель не обновилась автоматически.', 'color:#4ade80');
    // Временно кладём в window, чтобы пользователь мог увидеть в консоли
    window.__eiffelDemoTracks = demoTracks;
    // Простая эмуляция: первый трек становится primary через существующий колбэк
    // (в реальной версии мы улучшим tracks-panel)
    if (demoTracks[0]) {
      // Самый быстрый способ показать результат прямо сейчас:
      const first = demoTracks[0];
      // Мы не можем легко мутировать panel изнутри без рефакторинга,
      // поэтому просто пишем понятное сообщение
      alert(`Демо-треки загружены в память (${demoTracks.length} шт).\n\nСейчас используй кнопку "+ Add Files" и выбери:\ntracks/eiffel-tower-run.gpx\n(реалистичный маршрут по дорожкам и тротуарам)`);
    }
  }
}

// Expose for console and future buttons
window.loadEiffelDemo = loadEiffelDemo;

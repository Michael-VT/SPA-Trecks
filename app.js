import {
    loadTracks
} from './modules/parser.js';

import {
	applyDriftCorrection 
} from './modules/drift.js';

import {
    drawTracks,
    movePlaybackMarker
} from './modules/renderer.js';

import {
    createCharts,
    updateChartCursor,
    bindChartToMap
} from './modules/charts.js';

import {
    calculateStatistics
} from './modules/statistics.js';

import {
    enableMobileGestures
} from './modules/mobile.js';

import {
    exportCSV,
    exportJSON,
    exportGPX,
    exportScreenshot
} from './modules/export.js';

import { 
	initUI, 
	toggleFullscreen 
} from "./modules/ui.js";

const map = L.map('map', {
    preferCanvas:true
});

map.setView([39.36, -9.37], 13);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let tracks = [];

let playbackIndex = 0;

let playbackRunning = false;

let playbackTrack = [];

let playbackSpeed = 1;

let currentMode = "speed";

// ----------------------------
// Load all tracks
// ----------------------------

tracks = await loadTracks([

    'tracks/route1.gpx',
    'tracks/route2.tcx',
    'tracks/route3.kml'

]);

bindChartToMap((index) => {

    const p = playbackTrack[index];

    playbackIndex = index;

    movePlaybackMarker(map, p);

    updateHUD(p);

    updateChartCursor(index);
});

// primary track

playbackTrack = tracks[0];

// 🔧 APPLY DRIFT CORRECTION
playbackTrack = applyDriftCorrection(playbackTrack);

drawTracks(map, tracks, currentMode);

createCharts(playbackTrack);

calculateStatistics(playbackTrack);

map.fitBounds(
    playbackTrack.map(p => [p.lat, p.lon])
);

// ----------------------------
// Playback
// ----------------------------

function playbackStep() {

    if (!playbackRunning) return;

    if (playbackIndex >= playbackTrack.length) {

        playbackRunning = false;

        return;
    }

    const p = playbackTrack[playbackIndex];

    movePlaybackMarker(map, p);

    updateHUD(p);

    updateChartCursor(playbackIndex);

    playbackIndex++;

    requestAnimationFrame(playbackStep);
}

// ----------------------------
// HUD
// ----------------------------

function updateHUD(p) {

    document.getElementById('speedLabel')
        .innerText =
            p.speed
                ? p.speed.toFixed(1) + ' km/h'
                : '-';

    document.getElementById('hrLabel')
        .innerText =
            p.hr || '-';

    document.getElementById('eleLabel')
        .innerText =
            p.ele
                ? p.ele.toFixed(1) + ' m'
                : '-';

    document.getElementById('timeLabel')
        .innerText =
            p.time || '-';
}

// ----------------------------
// Buttons
// ----------------------------

document.getElementById('playBtn')
.onclick = () => {

    playbackRunning = true;

    playbackStep();
};

document.getElementById('pauseBtn')
.onclick = () => {

    playbackRunning = false;
};

document.getElementById('chartsBtn')
.onclick = () => {

    document
        .getElementById('chartContainer')
        .classList
        .toggle('visible');
};

// ----------------------------
// Keyboard
// ----------------------------

document.addEventListener('keydown', e => {

    const k = e.key.toLowerCase();

   if (k === 'x') {
       exportCSV(playbackTrack);
   }

   if (k === 'z') {
       exportJSON(playbackTrack);
   }
   if (k === 's') {

        currentMode = 'speed';

        drawTracks(map, tracks, currentMode);
    }

    if (k === 'h') {

        currentMode = 'height';

        drawTracks(map, tracks, currentMode);
    }

    if (k === 'p') {

        currentMode = 'pulse';

        drawTracks(map, tracks, currentMode);
    }

    if (k === ' ') {

        playbackRunning =
            !playbackRunning;

        if (playbackRunning) {

            playbackStep();
        }
    }

    if (k === 'arrowright') {

        playbackIndex += 20;
    }

    if (k === 'arrowleft') {

        playbackIndex -= 20;

        if (playbackIndex < 0)
            playbackIndex = 0;
    }
});

// ----------------------------
// Mobile
// ----------------------------

enableMobileGestures({

    onSwipeLeft() {
        currentMode = 'speed';
        drawTracks(map, tracks, currentMode);
    },

    onSwipeRight() {
        currentMode = 'height';
        drawTracks(map, tracks, currentMode);
    },

    onSwipeUp() {
        document
            .getElementById('chartContainer')
            .classList.add('visible');
    },

    onSwipeDown() {
        document
            .getElementById('chartContainer')
            .classList.remove('visible');
    },

    onDoubleTap() {

        playbackRunning = !playbackRunning;

        if (playbackRunning) playbackStep();
    },

    onLongPress(ev) {

        // позже сюда добавим:
        // - inspect point
        // - mini HUD
        console.log("LONG PRESS", ev);
    }
});


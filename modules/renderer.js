// renderer.js — color-coded heatmap route, playback marker, legend, tooltip

let marker = null;
let polylines = [];
let tooltipTimer = null;
let lastClosest = -1;
let tooltipTrack = null;

// Color: green (low) → yellow → red (high) via HSL
function colorForRatio(ratio) {
    const h = 120 * (1 - Math.max(0, Math.min(1, ratio)));
    return `hsl(${h},100%,50%)`;
}

function val(p, mode) {
    if (mode === "speed") return p.speed || 0;
    if (mode === "height") return p.eleCorrected ?? p.ele ?? 0;
    if (mode === "pulse") return p.hr || 0;
    return 0;
}

function getValueRange(track, mode) {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < track.length; i++) {
        const v = val(track[i], mode);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
    }
    return [lo, hi];
}

function clearPolylines() {
    polylines.forEach(p => p.remove());
    polylines = [];
}

function pushSeg(map, renderer, color, coords) {
    const pl = L.polyline(coords, {
        color, weight: 4, opacity: 0.9, renderer
    }).addTo(map);
    polylines.push(pl);
}

function drawHeatmap(map, renderer, track, mode) {
    const [lo, hi] = getValueRange(track, mode);
    const range = hi - lo || 1;
    const BUCKETS = 32;
    let bucket = -1, coords = [];

    for (let i = 0; i < track.length; i++) {
        const b = Math.min(BUCKETS - 1, Math.floor(((val(track[i], mode) - lo) / range) * BUCKETS));
        if (b !== bucket && coords.length > 1) {
            pushSeg(map, renderer, colorForRatio(bucket / (BUCKETS - 1)), coords);
            coords = [coords[coords.length - 1]]; // overlap for continuity
        }
        bucket = b;
        coords.push([track[i].lat, track[i].lon]);
    }
    if (coords.length > 1) pushSeg(map, renderer, colorForRatio(bucket / (BUCKETS - 1)), coords);
}

function ensureMarker(map, point) {
    if (!marker) {
        marker = L.circleMarker([point.lat, point.lon], {
            radius: 7, color: "#fff", fillColor: "#ffd700", fillOpacity: 1, weight: 2
        }).addTo(map);
    }
    marker.setLatLng([point.lat, point.lon]);
}

function updateLegend(mode, lo, hi) {
    const el = document.getElementById("legend");
    if (!el) return;
    const unit = mode === "speed" ? "km/h" : mode === "height" ? "m" : "bpm";
    const label = mode === "speed" ? "Скорость" : mode === "height" ? "Высота" : "Пульс";
    const stops = Array.from({ length: 11 }, (_, i) => colorForRatio(i / 10));
    el.innerHTML = `<b>${label}</b><br>
        <div style="width:150px;height:10px;border-radius:3px;margin:4px 0;
            background:linear-gradient(to right,${stops.join(",")})"></div>
        <div style="display:flex;justify-content:space-between;font-size:11px">
            <span>${lo.toFixed(1)} ${unit}</span><span>${hi.toFixed(1)} ${unit}</span></div>`;
}

function hideLegend() {
    const el = document.getElementById("legend");
    if (el) el.innerHTML = "";
}

// ── Single-track rendering (backward compat) ──────

export function drawTracks(map, track, mode) {
    clearPolylines();
    if (!track || track.length < 2) return;

    const renderer = L.canvas({ padding: 0.5 });
    drawHeatmap(map, renderer, track, mode);
    ensureMarker(map, track[0]);
    tooltipTrack = track;

    const [lo, hi] = getValueRange(track, mode);
    updateLegend(mode, lo, hi);
}

// ── Multi-track rendering ──────────────────────────

export function drawMultipleTracks(map, trackList, mode) {
    clearPolylines();
    if (!trackList || !trackList.length) { hideLegend(); return; }

    const renderer = L.canvas({ padding: 0.5 });

    // Draw non-primary tracks first (underneath)
    for (const t of trackList) {
        if (!t.isPrimary && t.points.length >= 2) {
            const pl = L.polyline(t.points.map(p => [p.lat, p.lon]), {
                color: t.color, weight: 3, opacity: 0.7, renderer
            }).addTo(map);
            polylines.push(pl);
        }
    }

    // Draw primary with heatmap on top
    const primary = trackList.find(t => t.isPrimary);
    if (primary && primary.points.length >= 2) {
        drawHeatmap(map, renderer, primary.points, mode);
        ensureMarker(map, primary.points[0]);
        tooltipTrack = primary.points;
        const [lo, hi] = getValueRange(primary.points, mode);
        updateLegend(mode, lo, hi);
    } else {
        hideLegend();
    }
}

// ── Playback marker ────────────────────────────────

export function movePlaybackMarker(map, point) {
    if (marker && point) marker.setLatLng([point.lat, point.lon]);
}

// ── Tooltip ────────────────────────────────────────

export function setTooltipTrack(track) {
    tooltipTrack = track;
    lastClosest = -1;
}

export function setupTooltip(map) {
    const tip = document.getElementById("tooltip");
    if (!tip) return;

    map.on("mousemove", (e) => {
        const track = tooltipTrack;
        if (!track || !track.length) return;
        let ci = -1, cd = Infinity;
        // Coarse scan
        for (let i = 0; i < track.length; i += 8) {
            const d = map.latLngToLayerPoint([track[i].lat, track[i].lon]).distanceTo(e.layerPoint);
            if (d < cd) { cd = d; ci = i; }
        }
        // Refine ±8
        if (ci >= 0) {
            for (let i = Math.max(0, ci - 8); i <= Math.min(track.length - 1, ci + 8); i++) {
                const d = map.latLngToLayerPoint([track[i].lat, track[i].lon]).distanceTo(e.layerPoint);
                if (d < cd) { cd = d; ci = i; }
            }
        }
        if (cd > 25) { clearTimeout(tooltipTimer); tip.style.display = "none"; lastClosest = -1; return; }
        if (ci === lastClosest) return;
        lastClosest = ci;
        clearTimeout(tooltipTimer);
        tip.style.display = "none";

        tooltipTimer = setTimeout(() => {
            const p = track[ci];
            if (!p) return;
            const ele = p.eleCorrected ?? p.ele;
            tip.innerHTML = `<b>Точка ${ci}</b><br>
                Скорость: ${p.speed != null ? p.speed.toFixed(1) + " km/h" : "—"}<br>
                Высота: ${ele != null ? ele.toFixed(1) + " m" : "—"}<br>
                Пульс: ${p.hr ?? "—"}<br>
                Время: ${p.time ? new Date(p.time).toLocaleTimeString() : "—"}<br>
                Расст.: ${p.distance != null ? (p.distance / 1000).toFixed(2) + " km" : "—"}<br>
                <span style="font-size:10px;color:#888">${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}</span>`;
            tip.style.left = (e.originalEvent.clientX + 15) + "px";
            tip.style.top = (e.originalEvent.clientY - 10) + "px";
            tip.style.display = "block";
        }, 2000);
    });

    map.on("mouseout", () => { clearTimeout(tooltipTimer); tip.style.display = "none"; lastClosest = -1; });
}

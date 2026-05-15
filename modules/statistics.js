// statistics.js — route statistics calculation + overlay table

export function calculateStatistics(track) {
    if (!track || !track.length) return null;
    const s = {
        totalDistance: 0, duration: 0,
        avgSpeed: 0, maxSpeed: 0,
        elevationGain: 0, elevationLoss: 0,
        minElevation: Infinity, maxElevation: -Infinity,
        avgHR: 0, maxHR: 0,
        startTime: null, endTime: null, pointCount: track.length
    };
    let spdSum = 0, spdN = 0, hrSum = 0, hrN = 0;
    for (let i = 0; i < track.length; i++) {
        const p = track[i];
        const ele = p.eleCorrected ?? p.ele;
        if (ele != null) {
            if (ele < s.minElevation) s.minElevation = ele;
            if (ele > s.maxElevation) s.maxElevation = ele;
            if (i > 0) {
                const prev = track[i - 1].eleCorrected ?? track[i - 1].ele;
                if (prev != null) {
                    const d = ele - prev;
                    if (d > 0) s.elevationGain += d; else s.elevationLoss += Math.abs(d);
                }
            }
        }
        if (p.speed > 0) { spdSum += p.speed; spdN++; if (p.speed > s.maxSpeed) s.maxSpeed = p.speed; }
        if (p.hr > 0) { hrSum += p.hr; hrN++; if (p.hr > s.maxHR) s.maxHR = p.hr; }
    }
    s.totalDistance = track[track.length - 1].distance || 0;
    if (track[0].time && track[track.length - 1].time) {
        s.duration = (new Date(track[track.length - 1].time) - new Date(track[0].time)) / 1000;
        s.startTime = track[0].time;
        s.endTime = track[track.length - 1].time;
    }
    s.avgSpeed = spdN ? spdSum / spdN : 0;
    s.avgHR = hrN ? hrSum / hrN : 0;
    return s;
}

let overlay = null;

export function showStatisticsTable(track) {
    const s = calculateStatistics(track);
    if (!s) return;
    if (!overlay) { overlay = document.createElement("div"); overlay.id = "statsOverlay"; document.body.appendChild(overlay); }
    const fmt = sec => { const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), ss = Math.floor(sec % 60); return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`; };
    const row = (l, v) => `<tr><td style="padding:4px 12px;color:#aaa">${l}</td><td style="padding:4px 12px;text-align:right;font-weight:600">${v}</td></tr>`;
    overlay.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:2000;display:flex;align-items:center;justify-content:center" onclick="document.getElementById('statsOverlay').style.display='none'">
        <div style="background:#1a1a1a;color:#fff;padding:24px;border-radius:12px;min-width:300px;max-width:90vw" onclick="event.stopPropagation()">
        <h3 style="margin:0 0 16px;color:#ffd700">📊 Статистика маршрута</h3>
        <table style="width:100%;border-collapse:collapse">
        ${row("Расстояние", (s.totalDistance / 1000).toFixed(2) + " km")}
        ${row("Длительность", fmt(s.duration))}
        ${row("Ср. скорость", s.avgSpeed.toFixed(1) + " km/h")}
        ${row("Макс. скорость", s.maxSpeed.toFixed(1) + " km/h")}
        ${row("Набор высоты", s.elevationGain.toFixed(1) + " m")}
        ${row("Потеря высоты", s.elevationLoss.toFixed(1) + " m")}
        ${row("Мин. высота", s.minElevation.toFixed(1) + " m")}
        ${row("Макс. высота", s.maxElevation.toFixed(1) + " m")}
        ${s.avgHR > 0 ? row("Ср. пульс", s.avgHR.toFixed(0) + " bpm") : ""}
        ${s.maxHR > 0 ? row("Макс. пульс", s.maxHR + " bpm") : ""}
        ${row("Точек", s.pointCount)}
        ${row("Начало", s.startTime ? new Date(s.startTime).toLocaleString() : "—")}
        ${row("Конец", s.endTime ? new Date(s.endTime).toLocaleString() : "—")}
        </table>
        <div style="text-align:center;margin-top:12px;color:#666;font-size:11px">T или клик — закрыть</div>
        </div></div>`;
    overlay.style.display = "block";
}

export function hideStatisticsTable() { if (overlay) overlay.style.display = "none"; }

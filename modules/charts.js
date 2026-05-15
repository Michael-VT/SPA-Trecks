// charts.js — synced Chart.js panel (speed / elevation / HR)
let chart = null;
let chartData = [];
let cursorCallback = null;

export function createCharts(track) {
    chartData = track;
    const ctx = document.getElementById("chart")?.getContext("2d");
    if (!ctx) return;

    if (chart) chart.destroy();

    const speed = track.map(p => p.speed ?? 0);
    const ele = track.map(p => p.eleCorrected ?? p.ele ?? 0);
    const hr = track.map(p => p.hr ?? 0);

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: track.map((_, i) => i),
            datasets: [
                { label: "Speed km/h", data: speed, borderColor: "#4488ff", backgroundColor: "rgba(68,136,255,.08)", tension: .2, pointRadius: 0, borderWidth: 1.5, fill: true },
                { label: "Elevation m", data: ele, borderColor: "#44bb44", backgroundColor: "rgba(68,187,68,.08)", tension: .2, pointRadius: 0, borderWidth: 1.5, fill: true, yAxisID: "y1" },
                { label: "HR bpm", data: hr, borderColor: "#ff4444", tension: .2, pointRadius: 0, borderWidth: 1.5, fill: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: true, labels: { color: "#ccc", font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        title: items => {
                            const p = chartData[items[0].dataIndex];
                            return p?.time ? new Date(p.time).toLocaleTimeString() : `#${items[0].dataIndex}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { position: "left", title: { display: true, text: "Speed / HR", color: "#888" }, grid: { color: "rgba(255,255,255,.06)" }, ticks: { color: "#888" } },
                y1: { position: "right", title: { display: true, text: "Elevation m", color: "#888" }, grid: { drawOnChartArea: false }, ticks: { color: "#888" } }
            },
            onHover(_, elements) {
                if (elements.length && cursorCallback) cursorCallback(elements[0].index);
            }
        }
    });

    // Click scrub
    chart.canvas.addEventListener("click", e => {
        const pts = chart.getElementsAtEventForMode(e, "index", { intersect: false }, true);
        if (pts.length && cursorCallback) cursorCallback(pts[0].index);
    });
    // Touch scrub
    chart.canvas.addEventListener("touchmove", e => {
        const t = e.touches[0], r = chart.canvas.getBoundingClientRect();
        const pts = chart.getElementsAtEventForMode({ x: t.clientX - r.left, y: 0 }, "index", { intersect: false }, true);
        if (pts.length && cursorCallback) cursorCallback(pts[0].index);
    });
}

export function updateChartCursor(index) {
    if (!chart) return;
    chart.setActiveElements([
        { datasetIndex: 0, index },
        { datasetIndex: 1, index },
        { datasetIndex: 2, index }
    ]);
    chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
    chart.update("none");
}

export function bindChartToMap(cb) { cursorCallback = cb; }

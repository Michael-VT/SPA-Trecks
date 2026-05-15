let chart = null;
let chartData = [];
let chartLabels = [];

let externalCursorCallback = null;

chart.canvas.addEventListener('mousemove', (e) => {

    const points = chart.getElementsAtEventForMode(
        e,
        'index',
        { intersect: false },
        true
    );

    if (!points.length) return;

    const index = points[0].index;

    if (externalCursorCallback) {
        externalCursorCallback(index);
    }
});

chart.canvas.addEventListener('touchmove', (e) => {

    const touch = e.touches[0];

    const rect = chart.canvas.getBoundingClientRect();

    const x = touch.clientX - rect.left;

    const points = chart.getElementsAtEventForMode(
        { x, y: 0 },
        'index',
        { intersect: false },
        true
    );

    if (!points.length) return;

    const index = points[0].index;

    if (externalCursorCallback) {
        externalCursorCallback(index);
    }
});

chart.canvas.addEventListener('click', (e) => {

    const points = chart.getElementsAtEventForMode(
        e,
        'index',
        { intersect: false },
        true
    );

    if (!points.length) return;

    const index = points[0].index;

    if (externalCursorCallback) {
        externalCursorCallback(index);
    }
});

export function createCharts(track) {

    chartData = track;

    chartLabels = track.map((p, i) => i);

    const ctx = document.getElementById('chart').getContext('2d');

    const speed = track.map(p => p.speed || 0);
    const ele = track.map(p => p.eleCorrected || 0);
    const hr = track.map(p => p.hr || 0);

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Speed',
                    data: speed,
                    borderColor: 'blue',
                    tension: 0.2,
                    pointRadius: 0
                },
                {
                    label: 'Elevation',
                    data: ele,
                    borderColor: 'green',
                    tension: 0.2,
                    pointRadius: 0
                },
                {
                    label: 'Heart Rate',
                    data: hr,
                    borderColor: 'red',
                    tension: 0.2,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true
                }
            },
            onHover: (event, elements) => {

                if (!elements.length) return;

                const index = elements[0].index;

                if (externalCursorCallback) {
                    externalCursorCallback(index);
                }
            }
        }
    });
}


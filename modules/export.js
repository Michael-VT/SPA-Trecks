export function exportCSV(track) {

    let csv = "index,time,lat,lon,speed,hr,ele,distance\n";

    track.forEach((p, i) => {

        csv += [
            i,
            p.time || "",
            p.lat,
            p.lon,
            p.speed || "",
            p.hr || "",
            p.eleCorrected ?? p.ele ?? "",
            p.distance || ""
        ].join(",") + "\n";
    });

    download(csv, "track.csv", "text/csv");
}

export function exportJSON(track) {

    const json = JSON.stringify(track, null, 2);

    downloadFile(json, "track.json", "application/json");
}

function downloadFile(content, filename, type) {

    const blob = new Blob([content], { type });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

export function exportGPX(track) {

    let gpx =
`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrackViewer">
<trk><name>export</name><trkseg>
`;

    track.forEach(p => {

        gpx += `
<trkpt lat="${p.lat}" lon="${p.lon}">
`;

        if (p.eleCorrected != null || p.ele != null) {
            gpx += `<ele>${p.eleCorrected ?? p.ele}</ele>`;
        }

        if (p.time) {
            gpx += `<time>${p.time}</time>`;
        }

        gpx += `</trkpt>`;
    });

    gpx += `
</trkseg></trk></gpx>`;

    download(gpx, "track.gpx", "application/gpx+xml");
}

export function exportScreenshot() {

    html2canvas(document.body).then(canvas => {

        const link = document.createElement("a");

        link.download = "track.png";

        link.href = canvas.toDataURL();

        link.click();
    });
}

function download(content, filename, type) {

    const blob = new Blob([content], { type });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

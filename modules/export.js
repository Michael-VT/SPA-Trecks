// export.js — CSV / JSON / GPX / screenshot export

export function exportCSV(track) {
    let csv = "index,time,lat,lon,speed,hr,ele,distance\n";
    track.forEach((p, i) => {
        csv += [i, p.time || "", p.lat.toFixed(7), p.lon.toFixed(7),
            p.speed?.toFixed(2) || "", p.hr ?? "",
            (p.eleCorrected ?? p.ele)?.toFixed(1) || "",
            p.distance?.toFixed(1) || ""].join(",") + "\n";
    });
    dl(csv, "track.csv", "text/csv");
}

export function exportJSON(track) {
    dl(JSON.stringify(track, null, 2), "track.json", "application/json");
}

export function exportGPX(track) {
    let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="TrackViewer">\n<trk><name>export</name><trkseg>\n';
    track.forEach(p => {
        gpx += `<trkpt lat="${p.lat}" lon="${p.lon}">`;
        const ele = p.eleCorrected ?? p.ele;
        if (ele != null) gpx += `<ele>${ele.toFixed(1)}</ele>`;
        if (p.time) gpx += `<time>${p.time}</time>`;
        gpx += `</trkpt>\n`;
    });
    gpx += "</trkseg></trk></gpx>";
    dl(gpx, "track.gpx", "application/gpx+xml");
}

export function exportScreenshot() {
    if (typeof html2canvas === "undefined") return;
    html2canvas(document.body).then(c => {
        const a = document.createElement("a");
        a.download = "track.png"; a.href = c.toDataURL(); a.click();
    });
}

function dl(content, name, type) {
    const b = new Blob([content], { type }), u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(u);
}

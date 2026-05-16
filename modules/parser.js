// parser.js — GPX / TCX / KML loader → unified {lat,lon,ele,time,hr,speed,distance}
// Parse a local File object (GPX / TCX / KML)
export async function parseTrackFromFile(file) {
    const text = await file.text();
    const points = parseTrack(text, file.name);
    return enrichTrack(points);
}

export async function loadTracks(urls) {
    const tracks = [];
    for (const url of urls) {
        try {
            const resp = await fetch(url);
            const text = await resp.text();
            const points = parseTrack(text, url);
            tracks.push(enrichTrack(points));
        } catch (e) {
            console.warn(`Failed to load ${url}:`, e);
            tracks.push([]);
        }
    }
    return tracks;
}

function parseTrack(text, url) {
    const xml = new DOMParser().parseFromString(text, "text/xml");
    if (xml.querySelector("parsererror")) { console.warn("XML error:", url); return []; }
    if (url.endsWith(".gpx")) return parseGPX(xml);
    if (url.endsWith(".tcx")) return parseTCX(xml);
    if (url.endsWith(".kml")) return parseKML(xml);
    return [];
}

function parseGPX(xml) {
    const pts = [];
    xml.querySelectorAll("trkpt").forEach(pt => {
        const lat = parseFloat(pt.getAttribute("lat"));
        const lon = parseFloat(pt.getAttribute("lon"));
        if (isNaN(lat) || isNaN(lon)) return;
        pts.push({
            lat, lon,
            ele: num(pt.querySelector("ele")?.textContent),
            time: pt.querySelector("time")?.textContent || null,
            hr: int(pt.querySelector("hr")?.textContent)
        });
    });
    return pts;
}

function parseTCX(xml) {
    const pts = [];
    xml.querySelectorAll("Trackpoint").forEach(pt => {
        const lat = num(pt.querySelector("LatitudeDegrees")?.textContent);
        const lon = num(pt.querySelector("LongitudeDegrees")?.textContent);
        if (lat == null || lon == null) return;
        const hrEl = pt.querySelector("HeartRateBpm");
        let hr = null;
        if (hrEl) {
            const v = hrEl.querySelector("Value");
            hr = int(v ? v.textContent : hrEl.textContent);
        }
        pts.push({
            lat, lon,
            ele: num(pt.querySelector("AltitudeMeters")?.textContent),
            time: pt.querySelector("Time")?.textContent || null,
            hr
        });
    });
    return pts;
}

function parseKML(xml) {
    const pts = [];
    xml.querySelectorAll("Placemark").forEach(pm => {
        const coordEl = pm.querySelector("Point coordinates") || pm.querySelector("coordinates");
        if (!coordEl) return;
        const parts = coordEl.textContent.trim().split(",").map(s => parseFloat(s.trim()));
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
        const ts = pm.querySelector("TimeSpan");
        let time = null;
        if (ts) time = (ts.querySelector("begin") || ts.querySelector("end"))?.textContent || null;
        pts.push({
            lat: parts[1], lon: parts[0],
            ele: parts[2] != null && !isNaN(parts[2]) ? parts[2] : null,
            time, hr: null
        });
    });
    return pts;
}

function num(s) { return s != null ? (isNaN(s = parseFloat(s)) ? null : s) : null; }
function int(s) { return s != null ? (isNaN(s = parseInt(s)) ? null : s) : null; }

function haversine(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const x = Math.sin(dLat / 2) ** 2 +
              Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function enrichTrack(points) {
    let dist = 0, prevTime = null, prevSpd = 0;
    for (let i = 0; i < points.length; i++) {
        if (i === 0) {
            points[i].speed = 0;
            points[i].distance = 0;
            prevTime = points[i].time ? new Date(points[i].time) : null;
            continue;
        }
        const d = haversine(points[i - 1], points[i]);
        dist += d;
        points[i].distance = dist;
        if (points[i].time) {
            const t = new Date(points[i].time);
            if (prevTime) {
                const dt = (t - prevTime) / 1000;
                points[i].speed = dt > 0 ? (d / dt) * 3.6 : prevSpd;
            } else {
                points[i].speed = 0;
            }
            prevTime = t;
        } else {
            points[i].speed = prevSpd;
        }
        if (points[i].speed > 100) points[i].speed = prevSpd; // GPS noise clamp
        prevSpd = points[i].speed;
    }
    return points;
}

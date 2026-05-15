let marker = null;

export function drawTracks(map, tracks, mode) {

    const track = tracks[0];

    const path = track.map(p => [p.lat, p.lon]);

    L.polyline(path, {
        color: 'white',
        weight: 3
    }).addTo(map);

    if (!marker) {

        marker = L.circleMarker(path[0], {
            radius: 7,
            color: 'yellow',
            fillColor: 'yellow',
            fillOpacity: 1
        }).addTo(map);
    }
}

export function movePlaybackMarker(map, point) {

    if (!marker) return;

    marker.setLatLng([point.lat, point.lon]);
}


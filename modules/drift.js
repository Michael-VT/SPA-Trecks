// drift.js — altitude smoothing + start/end drift correction
export function applyDriftCorrection(track) {
    if (!track || track.length < 2) return track;
    const W = 5;
    for (let i = 0; i < track.length; i++) {
        let sum = 0, n = 0;
        for (let j = i - W; j <= i + W; j++) {
            if (j >= 0 && j < track.length && track[j].ele != null) { sum += track[j].ele; n++; }
        }
        track[i].eleSmooth = n > 0 ? sum / n : (track[i].ele || 0);
    }
    const drift = track[track.length - 1].eleSmooth - track[0].eleSmooth;
    const len = track.length - 1;
    for (let i = 0; i <= len; i++) {
        track[i].eleCorrected = track[i].eleSmooth - drift * (i / len);
    }
    return track;
}

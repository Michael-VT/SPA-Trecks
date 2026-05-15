export function applyDriftCorrection(track) {

    if (!track || track.length < 2) return track;

    // -------------------------
    // 1. SMOOTH ALTITUDE (moving average)
    // -------------------------

    const windowSize = 5;

    for (let i = 0; i < track.length; i++) {

        let sum = 0;
        let count = 0;

        for (let j = i - windowSize; j <= i + windowSize; j++) {

            if (track[j] && track[j].ele != null) {
                sum += track[j].ele;
                count++;
            }
        }

        if (count > 0) {
            track[i].eleSmooth = sum / count;
        } else {
            track[i].eleSmooth = track[i].ele || 0;
        }
    }

    // -------------------------
    // 2. START/END DRIFT FIX
    // -------------------------

    const start = track[0];
    const end = track[track.length - 1];

    if (start.eleSmooth != null && end.eleSmooth != null) {

        const drift = end.eleSmooth - start.eleSmooth;

        const n = track.length;

        for (let i = 0; i < n; i++) {

            const ratio = i / (n - 1);

            track[i].eleCorrected =
                track[i].eleSmooth - drift * ratio;
        }
    }

    return track;
}

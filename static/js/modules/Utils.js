export function secondsToMSS(seconds) {
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export function easeOutExponential(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function smoothStep(t) {
    return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3);
}
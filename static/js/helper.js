export function setAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

export function secondsToMSS(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(1, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export function easeOutQuadratic(t) {
    return 1 - Math.pow(1 - t, 2);
}

export function smoothStep(t) {
    return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3);
}
export function secondsToMSS(seconds) {
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export function easeOutExponential(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    // TODO: change to a bezier curve
}

export function smoothStep(t) {
    return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3);
}

export function addEventListeners(elements, events, handler) {
    if (!elements.forEach) elements = [elements];
    if (!events.forEach) events = [events];
    elements.forEach((element) => {
        events.forEach((event) => {
            element.addEventListener(event, handler);
        });
    });
}
export function secondsToMSS(seconds) {
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export function easeOutExponential(t) {
    return 1 - (1 - t) * Math.pow(0.01, t);
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

export function* zip(...arrays) {
    const length = Math.min(...arrays.map(x => x.length));
    for (let i = 0; i < length; i++) yield arrays.map(array => array[i]);
}
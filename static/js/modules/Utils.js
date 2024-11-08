export const utils = (() => {
    /*................MATH................*/

    function easeOutExponential(t) {
        return 1 - (1 - t) * Math.pow(0.01, t)
    }

    function smoothStep(t) {
        return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3)
    }


    /*................ITERATOR................*/

    function* zip(...arrays) {
        const length = Math.min(...arrays.map(x => x.length));
        for (let i = 0; i < length; i++) {
            yield [...arrays.map(array => array[i]), i]
        }
    }

    function* pluck(object, indices) {
        for (const i of indices) {
            yield object[i]
        }
    }


    /*................DOM................*/

    function addEventListeners(elements, events, handler) {
        if (!elements.forEach) {
            elements = [elements];
        }
        if (!events.forEach) {
            events = [events];
        }
        elements.forEach((element) => {
            events.forEach((event) => {
                element.addEventListener(event, handler);
            });
        });
    }


    /*................OBJECT................*/

    function createObject(length, key, value) {
        const map = (_, i) => [key(i), value(i)];
        const entries = Array.from({ length }, map);
        return Object.fromEntries(entries)
    }


    /*................STRING................*/

    function secondsToMSS(seconds) {
        const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
        const formattedSeconds = String(seconds % 60).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`
    }


    return {
        math: { easeOutExponential, smoothStep },
        iterator: { zip, pluck },
        dom: { addEventListeners },
        object: { createObject },
        string: { secondsToMSS },
    }
})();
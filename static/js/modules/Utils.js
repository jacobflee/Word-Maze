export const Utils = (() => {
    function secondsToMSS(seconds) {
        const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
        const formattedSeconds = String(seconds % 60).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    
    function easeOutQuadratic(t) {
        return 1 - Math.pow(1 - t, 2);
    }
    
    function smoothStep(t) {
        return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3);
    }

    return { secondsToMSS, easeOutQuadratic, smoothStep };
})();
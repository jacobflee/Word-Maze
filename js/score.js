const scoreElement = document.getElementById('score');
const points = [100, 400, 800, 1400, 2200, 3200, 4800, 7200, 10400, 15200, 21600, 28800, 40000];

function addPointStep(step, count) {
    if (count < 100) {
        scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + step;
        setTimeout(() => addPointStep(step, count + 1), 1);
    }
}

export function addPoints(wordValue) {
    addPointStep(wordValue / 100, 0);
}

export function getWordValue(wordLength) {
    return points[wordLength - 3];
}
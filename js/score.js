const scoreElement = document.getElementById('score');
const points = [100, 400, 800, 1400, 2200, 3200, 4800, 7200, 10400, 15200, 21600, 28800, 40000];
var score = 0;

function addPointStep(step, wordValue) {
    if (wordValue > 0) {
        score += step;
        scoreElement.innerHTML = score;
        setTimeout(() => addPointStep(step, wordValue - step), 1);
    }
}

export function addPoints(wordValue) {
    addPointStep(wordValue / 100, wordValue);
}

export function getWordValue(wordLength) {
    return points[wordLength - 3];
}
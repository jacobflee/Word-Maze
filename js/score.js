const scoreElement = document.getElementById('score-value');
const points = [100, 400, 800, 1400, 2200, 3200, 4800, 7200, 10400, 15200, 21600, 28800, 40000];
var score = 0;

function addPointStep(step, wordValue) {
    score += step;
    scoreElement.innerHTML = score;
    if (wordValue > step)
        setTimeout(() => addPointStep(step, wordValue - step), 1);
}

export function addPoints(wordValue) {
    const step = wordValue / 100;
    addPointStep(step, wordValue);
}

export function getWordValue(wordLength) {
    return points[wordLength - 3];
}
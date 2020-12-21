const scoreElement = document.getElementById('score');
const points = [100, 400, 800, 1400, 2200, 3200, 4800, 7200, 10400, 15200, 21600, 28800, 40000, 100000];
var score = 0;

export function addPoints(wordLength) {
    score += points[wordLength - 3];
    scoreElement.innerHTML = score;
}
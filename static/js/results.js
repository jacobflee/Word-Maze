import { easeOutQuadratic } from './helper.js'


const domElements = {
    chartElement: document.getElementById('chart'),
    resultsScore: document.getElementById('resultsScore'),
    resultsLongestWord: document.getElementById('resultsLongestWord')
}

function createWordLengthChart(wordLengthDistribution) {
    domElements.chartElement.innerHTML = '<div>Word Length Distribution:</div>';
    wordLengthDistribution.forEach(([length, _]) => {
        const barElement = document.createElement('div');
        barElement.className = 'bar';
        const labelElement = document.createElement('div');
        labelElement.innerHTML = length < 10 ? `&nbsp;${length}` : length;
        const fillElement = document.createElement('div');
        fillElement.className = 'bar-fill';
        fillElement.style.width = '0%';
        const valueElement = document.createElement('div');
        valueElement.className = 'bar-value';
        valueElement.textContent = '0';
        barElement.appendChild(labelElement);
        barElement.appendChild(fillElement);
        barElement.appendChild(valueElement);
        domElements.chartElement.appendChild(barElement);
    });
    const totalWordCount = wordLengthDistribution.reduce((acc, [, count]) => acc + count, 0);
    function animateBarGraph(frame = 0) {
        const total = 80;
        if (frame > total) return;
        const progress = easeOutQuadratic(frame / total);
        domElements.chartElement.querySelectorAll('.bar').forEach((bar, index) => {
            const fillElement = bar.querySelector('.bar-fill');
            const valueElement = bar.querySelector('.bar-value');
            const wordCount = wordLengthDistribution[index][1];
            const percentage = wordCount / totalWordCount;
            fillElement.style.width = `${100 * progress * percentage}%`;
            valueElement.textContent = Math.round(progress * wordCount);
        });
        requestAnimationFrame(() => animateBarGraph(frame + 1));
    }
    animateBarGraph();
}

export function displayResults(score, longestWord, wordLengthDistribution) {
    domElements.resultsScore.textContent = score;
    domElements.resultsLongestWord.textContent = longestWord;
    createWordLengthChart(wordLengthDistribution);
    // changePage(domElements.resultsContainer);
    document.querySelectorAll('.pageContainer').forEach((pageContainer) => pageContainer.style.display = 'none');
    document.getElementById('resultsContainer').style.display = '';
}
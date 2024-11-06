import { smoothStep, easeOutExponential, zip } from '../utils.js'
import { TIMING } from '../config.js';


export class Animations {
    constructor() {
        this.countdownTimer = document.getElementById('countdown-timer');
        this.selectedLetters = document.getElementById('selected-letters');
        this.currentScore = document.getElementById('current-score');
        this.chartBars = this.createChartBars();
    }

    createChartBars() {
        const barFills = document.querySelectorAll('.bar-fill');
        const barCounts = document.querySelectorAll('.bar-count')
        return [...zip(barFills, barCounts)]
    }


    /*................GAME................*/

    cellSelection(cell, frame = 1) {
        const frames = TIMING.ANIMATION.CELL_SELECTION;
        if (frame > frames) return
        const progress = frame / frames;
        cell.style.width = `${93 + 7 * progress}%`;
        cell.style.height = cell.style.width;
        cell.style.borderRadius = `${40 - 15 * progress}%`;
        cell.style.fontSize = `calc(${11.5 + 2 * progress} * var(--base-unit))`;
        requestAnimationFrame(() => this.cellSelection(cell, frame + 1));
    }

    wordFadeOut(frame = 1) {
        const frames = TIMING.ANIMATION.WORD_FADE_OUT;
        if (frame > frames) {
            this.selectedLetters.innerHTML = '&nbsp;';
            this.selectedLetters.style.cssText = '';
        } else {
            const progress = frame / frames;
            this.selectedLetters.style.opacity = 1 - progress;
            requestAnimationFrame(() => this.wordFadeOut(frame + 1));
        }
    }

    scoreIncrease(score, points, frame = 1) {
        const frames = TIMING.ANIMATION.SCORE_INCREASE;
        if (frame > frames) return
        const progress = smoothStep(frame / frames);
        this.currentScore.textContent = score + Math.round(points * progress);
        requestAnimationFrame(() => this.scoreIncrease(score, points, frame + 1));
    }


    /*................RESULTS................*/

    barGraph(words, frame = 1) {
        if (words.count === 0) {
            for (const [barFill, barCount] of this.chartBars) {
                this.updateChartBar(barFill, barCount, '0%', '0');
            }
            return
        }
        const frames = TIMING.ANIMATION.BAR_GRAPH;
        if (frame > frames) return
        const progress = easeOutExponential(frame / frames);
        for (const [barFill, barCount, i] of this.chartBars) {
            const wordLengthCount = words.length[i + 3];
            const width = `${100 * progress * wordLengthCount / words.count}%`;
            const count = Math.round(progress * wordLengthCount);
            this.updateChartBar(barFill, barCount, width, count);
        }
        requestAnimationFrame(() => this.barGraph(words, frame + 1));
    }

    updateChartBar(barFill, barCount, width, count) {
        barFill.style.width = width;
        barCount.textContent = count;
    }
}
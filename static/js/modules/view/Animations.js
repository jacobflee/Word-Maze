import { smoothStep, easeOutExponential } from '../utils.js'
import { TIMING } from '../config.js';


export class Animations {
    constructor(view) {
        this.view = view;
    }


    /*................................GAME................................*/

    cellSelection(cell, frame = 1) {
        const frames = TIMING.ANIMATION.CELL_SELECTION;
        if (frame > frames) return;
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
            this.view.selectedLetters.innerHTML = '&nbsp;';
            this.view.selectedLetters.style.cssText = '';
        } else {
            const progress = frame / frames;
            this.view.selectedLetters.style.opacity = 1 - progress;
            requestAnimationFrame(() => this.wordFadeOut(frame + 1));
        }
    }

    scoreIncrease(score, points, frame = 1) {
        const frames = TIMING.ANIMATION.SCORE_INCREASE;
        if (frame > frames) return;
        const progress = smoothStep(frame / frames);
        this.view.currentScore.textContent = score + Math.round(points * progress);
        requestAnimationFrame(() => this.scoreIncrease(score, points, frame + 1));
    }


    /*................................RESULTS................................*/

    barGraph(words, frame = 1) {
        if (words.count === 0) {
            this.view.chartBars.forEach((chartBar) => this.updateChartBar(chartBar, '0%', '0'));
            return;
        }
        const frames = TIMING.ANIMATION.BAR_GRAPH;
        if (frame > frames) return;
        const progress = easeOutExponential(frame / frames);
        this.view.chartBars.forEach((chartBar, i) => {
            const wordLengthCount = words.length[i + 3];
            const width = `${100 * progress * wordLengthCount / words.count}%`;
            const count = Math.round(progress * wordLengthCount);
            this.updateChartBar(chartBar, width, count);
        });
        requestAnimationFrame(() => this.barGraph(words, frame + 1));
    }

    updateChartBar(chartBar, width, count) {
        const [ _, barFill, barCount ] = chartBar.children;
        barFill.style.width = width;
        barCount.textContent = count;
    }
}
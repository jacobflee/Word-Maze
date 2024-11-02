import { smoothStep, easeOutExponential } from '../utils.js'
import { TIMING } from '../config.js';


export class Animations {
    constructor(view) {
        this.view = view;
    }


    /*................................GAME................................*/

    cellSelection(cell, frame = 1) {
        const frames = TIMING.ANIMATION.CELL_SELECTION;
        if (frame > frames) {
            this.view.updateCellStyle(cell, '', '', '');
        } else {
            const progress = frame / frames;
            this.view.updateCellStyle(cell, `${93 + 7 * progress}%`, `${40 - 15 * progress}%`, `calc(${11.5 + 2 * progress} * var(--base-unit))`);
            requestAnimationFrame(() => this.cellSelection(cell, frame + 1));
        }
    }

    wordFadeOut(frame = 1) {
        const frames = TIMING.ANIMATION.WORD_FADE_OUT;
        if (frame > frames) {
            this.view.resetSelectedLetters();
        } else {
            const progress = frame / frames;
            this.view.setSelectedLettersOpacity(1 - progress);
            requestAnimationFrame(() => this.wordFadeOut(frame + 1));
        }
    }

    scoreIncrease(score, points, frame = 1) {
        const frames = TIMING.ANIMATION.SCORE_INCREASE;
        if (frame > frames) return;
        const progress = smoothStep(frame / frames);
        this.view.setCurrentScore(score + Math.round(points * progress));
        requestAnimationFrame(() => this.scoreIncrease(score, points, frame + 1));
    }


    /*................................RESULTS................................*/

    barGraph(words, frame = 1) {
        const frames = TIMING.ANIMATION.BAR_GRAPH;
        if (frame > frames) return;
        const progress = easeOutExponential(frame / frames);
        for (let i = 0; i < 13; i++) {
            const wordLengthCount = words.length[i + 3];
            const width = `${100 * progress * wordLengthCount / words.count}%`;
            const count = Math.round(progress * wordLengthCount);
            this.view.updateChartBar(i, width, count);
        }
        requestAnimationFrame(() => this.barGraph(words, frame + 1));
    }
}
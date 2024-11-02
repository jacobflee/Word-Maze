import { POINTS, TIMING } from '../config.js';
import { secondsToMSS } from '../utils.js'


export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.words = {
            count: 0,
            longest: '',
            valid: null,
            found: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, new Set()])),
            length: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, 0])),
        };
        this.time = {
            id: null,
            color: '',
            text: '',
            seconds: TIMING.GAME_DURATION,
        }
    }

    startTimer(updateTimer) {
        this.updateTimer(updateTimer);
        this.time.id = setInterval(() => this.updateTimer(updateTimer), 1000);
    }

    updateTimer(updateTimer) {
        this.time.seconds--;
        this.time.text = secondsToMSS(this.time.seconds);
        this.time.color = this.time.seconds < 10 ? COLORS.TEXT.TERTIARY : '';
        updateTimer();
        if (this.time.seconds === 0) {
            clearInterval(this.time.id);
            this.time.id = null;
        }
    }

    updateValidWords(words) {
        this.words.valid = Object.fromEntries(Object.entries(words).map(([length, words]) => [length, new Set(words)]));
    }

    checkWordValidity(word) {
        return [this.words.valid[word.length]?.has(word), this.words.found[word.length]?.has(word)];
    }

    addFoundWord(word) {
        this.words.count++;
        this.words.found[word.length].add(word);
        this.words.length[word.length]++;
        this.score += POINTS[word.length];
        if (word.length > this.words.longest.length)
            this.words.longest = word;
    }
}
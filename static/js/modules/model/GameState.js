import { COLORS, POINTS, TIMING } from '../config.js';


export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.foundWords = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, new Set()]));
        this.wordLengthDistribution = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, 0]));
        this.wordCount = 0;
        this.score = 0;
        this.validWords = {};
        this.secondsRemaining = TIMING.GAME_DURATION;
        this.longestWord = '';
        this.countdownTimerColor = '';
        this.timerId = null;
    }

    startTimer(callback) {
        this.timer(callback);
        this.timerId = setInterval(() => this.timer(callback), 1000);
    }

    timer(callback) {
        this.secondsRemaining--;
        this.countdownTimerColor = this.secondsRemaining < TIMING.WARNING_THRESHOLD ? COLORS.TIMER_WARNING : '';
        callback();
        if (this.secondsRemaining <= 0)
            this.stopTimer();
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    updateValidWords(words) {
        this.validWords = Object.fromEntries(Object.entries(words).map(([wordLength, words]) => [wordLength, new Set(words)]));
    }

    getValidity(word) {
        return [this.validWords[word.length]?.has(word), this.foundWords[word.length]?.has(word)];
    }

    addFoundWord(word) {
        this.wordCount++;
        this.foundWords[word.length].add(word);
        this.wordLengthDistribution[word.length]++;
        this.score += POINTS[word.length];
        if (word.length > this.longestWord.length)
            this.longestWord = word;
    }
}
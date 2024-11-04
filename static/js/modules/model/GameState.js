import { POINTS, TIMING } from '../config.js';
import { secondsToMSS } from '../utils.js'


export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.words = {
            count: 0,
            longest: '',
            valid: null,
            found: this.createObject(13, (i) => i + 3, () => new Set()),
            length: this.createObject(13, (i) => i + 3, () => 0),
        };
        this.time = {
            id: null,
            color: '',
            content: '',
            seconds: TIMING.GAME_DURATION,
        };
        this.game = {
            score: 0,
        }
    }

    createObject(length, key, value) {
        return Object.fromEntries(
            Array.from(
                { length },
                (_, i) => [key(i), value(i)]
            )
        )
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
        this.words.valid = Object.fromEntries(
            Object.entries(words).map(
                ([length, words]) => [length, new Set(words)]
            )
        );
    }

    checkWordValidity(word) {
        return [this.words.valid[word.length]?.has(word), this.words.found[word.length]?.has(word)];
    }

    addFoundWord(word) {
        this.words.count++;
        this.words.found[word.length].add(word);
        this.words.length[word.length]++;
        this.game.score += POINTS[word.length];
        if (word.length > this.words.longest.length)
            this.words.longest = word;
    }
}
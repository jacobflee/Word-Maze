import { getGameData } from './api.js'


export class Model {
    /*................................GLOBAL................................*/
    /*................................HOME SCREEN................................*/
    /*................................GAME SCREEN................................*/
    /*................................RESULTS SCREEN................................*/
    constructor() {
        this.POINTS = {
            3: 100,
            4: 400,
            5: 800,
            6: 1400,
            7: 2200,
            8: 3200,
            9: 4400,
            10: 5800,
            11: 7400,
            12: 9200,
            13: 11200,
            14: 13400,
            15: 15800
        };

        this.COLORS = {
            DUPLICATE: 'rgb(220, 220, 40)',
            VALID: 'rgb(20, 180, 40)',
            SELECTED: 'rgb(40, 80, 240)'
        };
    }

    resetGameState() {
        this.gameState = {
            selectedLetters: '',
            isSelecting: false,
            lastSelectedColumn: -1,
            lastSelectedRow: -1,
            selectedCells: [],
            wordCount: 0,
            foundWords: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, new Set()])),
            wordLengthDistribution: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, 0])),
            score: 0,
            validWords: {},
            secondsRemaining: 91,
            longestWord: '',
        };
    }

    getGameState() {
        return this.gameState;
    }

    decrementSecondsRemaining() {
        this.gameState.secondsRemaining--;
    }

    updateValidWords(words) {
        this.gameState.validWords = Object.fromEntries(
            Object.entries(words).map(([key, value]) => [key, new Set(value)])
        );
    }

    setIsSelecting(value) {
        this.gameState.isSelecting = value;
    }

    addSelectedCell(cell) {
        this.gameState.selectedCells.push(cell);
    }

    addToSelectedLettersString(letter) {
        this.gameState.selectedLetters += letter;
    }

    updateLastSelectedPosition(cell) {
        this.gameState.lastSelectedRow = cell.style.gridRowStart;
        this.gameState.lastSelectedColumn = cell.style.gridColumnStart;
    }

    addFoundWord() {
        const word = this.gameState.selectedLetters;
        this.gameState.foundWords[word.length].add(word);
        this.gameState.wordLengthDistribution[word.length]++;
    }

    updateLongestWord() {
        this.gameState.longestWord = this.gameState.selectedLetters;
    }

    incrementWordCount() {
        this.gameState.wordCount++;
    }

    increaseScore(points) {
        this.gameState.score += points;
    }

    resetCellSelection() {
        this.gameState.selectedLetters = '';
        this.gameState.isSelecting = false;
        this.gameState.lastSelectedColumn = -1;
        this.gameState.lastSelectedRow = -1;
        this.gameState.selectedCells = [];
    }

    async getGameboard() {
        const gameData = await getGameData();
        this.updateValidWords(gameData.words);
        return gameData.board;
    }

    getUsername() {
        return localStorage.getItem('username');
    }

    setUsername(username) {
        localStorage.setItem('username', username);
    }
}
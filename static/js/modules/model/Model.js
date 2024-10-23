import { API } from './API.js'
import { GameState } from './GameState.js'
import { SelectionState } from './SelectionState.js'


export class Model {
    constructor() {
        this.api = new API();
        this.gameState = new GameState();
        this.selectionState = new SelectionState();
    }

    getUsername() {
        return localStorage.getItem('username');
    }

    setUsername(username) {
        localStorage.setItem('username', username);
    }

    async getGameboard() {
        const gameData = await this.api.getGameData();
        this.gameState.updateValidWords(gameData.words);
        return gameData.board;
    }

    addSelectedCell(cell) {
        this.selectionState.addCellBeforeValidation(cell);
        const [isValidWord, isFoundWord] = this.gameState.getValidity(this.selectionState.selectedLetters);
        this.selectionState.updateValidity(isValidWord, isFoundWord);
        this.selectionState.updateCellAfterValidation(cell);
    }

    addFoundWord() {
        this.gameState.addFoundWord(this.selectionState.selectedLetters);
    }
}
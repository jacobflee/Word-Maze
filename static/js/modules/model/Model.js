import { API } from './API.js'
import { GameState } from './GameState.js'
import { SelectionState } from './SelectionState.js'


export class Model {
    constructor() {
        this.api = new API();
        this.gameState = new GameState();
        this.selectionState = new SelectionState();
    }

    
    /*................GLOBAL................*/

    setLoading(value) {
        this.loading = value;
    }


    /*................HOME................*/

    getUsername() {
        return localStorage.getItem('username');
    }

    async setUsername(user_name) {
        const user_id = await this.api.createNewUser(user_name);
        this.userId = user_id;
        this.usernameValid = !!user_id;
        // check api that username was successfully added and return success state
        // localStorage.setItem('username', username);
        // this.usernameValid = false;
    }

    async getGameboard() {
        const gameData = await this.api.fetchNewGameData();
        this.gameState.updateValidWords(gameData.words);
        return gameData.board;
    }


    /*................GAME................*/

    addSelectedCell() {
        this.selectionState.updateSelectedCell();
        const word = this.selectionState.current.word.text;
        const [valid, found] = this.gameState.checkWordValidity(word);
        this.selectionState.updateValidatedCell(valid, found);
    }

    addFoundWord() {
        const word = this.selectionState.current.word.text;
        this.gameState.addFoundWord(word);
    }
}
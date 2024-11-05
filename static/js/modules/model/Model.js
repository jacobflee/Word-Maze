import { API } from './API.js'
import { GameState } from './GameState.js'
import { SelectionState } from './SelectionState.js'


export class Model {
    constructor() {
        this.api = new API();
        this.gameState = new GameState();
        this.selectionState = new SelectionState();

        this.loading = false;
        this.screen = 'home';
        this.mode = '';
        this.username = localStorage.getItem('userName');
        this.userId = localStorage.getItem('userId');
    }

    
    /*................GLOBAL................*/

    setLoading(value) {
        this.loading = value;
    }

    updateCurrentScreen(screen) {
        this.screen = screen;
    }

    setMode(mode) {
        this.mode = mode;
    }


    /*................HOME................*/

    async setUserName(userName) {
        const user_id = await this.api.createNewUser(userName);
        this.userId = user_id;
        this.userNameValid = !!user_id;
        // check api that userName was successfully added and return success state
        // localStorage.setItem('userName', userName);
        // this.userNameValid = false;
    }

    async initializeGameData() {
        const { board, words } = await this.api.fetchNewGameData();
        this.gameState.updateValidWords(words);
        this.selectionState.updateBoard(board);
    }


    /*................GAME................*/

    addSelectedCell() {
        this.selectionState.updateSelectedCell();
        const word = this.selectionState.word.text;
        const [valid, found] = this.gameState.checkWordValidity(word);
        this.selectionState.updateValidatedCell(valid, found);
    }

    addFoundWord() {
        const word = this.selectionState.word.text;
        this.gameState.addFoundWord(word);
    }
}
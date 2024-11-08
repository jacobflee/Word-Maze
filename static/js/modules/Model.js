import { config } from './config.js'
import { utils } from './utils.js'
import { API } from './API.js'


export class Model {
    constructor() {
        this.api = new API();
        this.navigation = {
            loading: false,
            screen: 'home',
            mode: '',
        };
        this.user = {
            name: localStorage.getItem('userName'),
            id: localStorage.getItem('userId'),
            error: null,
        }
        this.resetGame();
        this.resetSelection();
    }

    resetGame() {
        this.game = {
            score: 0,
            words: {
                count: 0,
                longest: '',
                valid: null,
                found: utils.object.createObject(13, (i) => i + 3, () => new Set()),
                length: utils.object.createObject(13, (i) => i + 3, () => 0),
            },
            time: {
                id: null,
                color: '',
                content: '',
                remaining: config.DURATION.GAME,
            },
            cells: Array.from({ length: 16 }, () => ({})),
        };
    }

    resetSelection() {
        this.selection = {
            selecting: false,
            word: {
                text: '',
                points: 0,
                valid: false,
                found: false,
                textContent: '',
                fontWeight: '',
                backgroundColor: '',
                color: '',
            },
            cell: {
                current: {
                    valid: false,
                    index: -1,
                    data: null,
                },
                previous: {
                    index: -1,
                    data: null,
                },
            },
            path: {
                indices: [],
                targets: [],
                color: '',
            },
        };
        this.game.cells.forEach((cell) => cell.color = '');
    }

    startSelection() {
        this.selection.selecting = true;
    }

    updateTargetCell(index) {
        const { current, previous } = this.selection.cell;
        current.index = index;
        current.data = this.game.cells[index];
        if (current.data.color !== '') { // cell is already selected
            current.valid = false;
        } else if (!previous.data) { // cell is the first selected
            current.valid = true;
        } else { // cell is within one space of previous
            const rowDifference = Math.abs(current.data.row - previous.data.row);
            const columnDifferent = Math.abs(current.data.column - previous.data.column);
            current.valid = rowDifference <= 1 && columnDifferent <= 1
        }
    }

    setLoading(value) {
        this.navigation.loading = value;
    }

    setCurrentScreen(screen) {
        this.navigation.screen = screen;
    }

    setMode(mode) {
        this.navigation.loading = true;
        this.navigation.mode = mode;
        this.resetGame();
    }

    setFormError(form, userName) {
        switch (userName) {
            case null:
                this[form].error = null;
                break
            case '':
                this[form].error = 'username is empty';
                break
            default:
                this[form].error = 'username has outer spaces';
        }
    }

    async setUserName(userName) {
        if (this.user.name === userName) return
        const apiCall = this.user.id
            ? this.api.updateUserName(this.user.id, userName)
            : this.api.createNewUser(userName);
        const data = await apiCall;
        this.user.error = data?.error;
        if (this.user.error) return
        if (!this.user.id) {
            this.user.id = data['user_id'];
            localStorage.setItem('userId', this.user.id);
        }
        this.user.name = userName;
        localStorage.setItem('userName', this.user.name);
    }

    async initializeGameData() {
        const { board, words } = await this.api.fetchNewGameData();
        const map = ([length, words]) => [length, new Set(words)];
        const entries = Object.entries(words).map(map);
        this.game.words.valid = Object.fromEntries(entries);
        this.game.cells.forEach((cell, index) => {
            const row = Math.floor(index / 4);
            const column = index % 4;
            cell.row = row + 1;
            cell.column = column + 1;
            cell.letter = board[row][column];
        });
    }

    startTimer(updateTimerDisplay) {
        this.updateTimer(updateTimerDisplay);
        this.game.time.id = setInterval(() => this.updateTimer(updateTimerDisplay), 1000);
    }

    updateTimer(updateTimerDisplay) {
        this.game.time.remaining--;
        this.game.time.text = utils.string.secondsToMSS(this.game.time.remaining);
        this.game.time.color = this.game.time.remaining < 10 ? config.COLOR.WARNING : '';
        updateTimerDisplay();
        if (this.game.time.remaining === 0) {
            clearInterval(this.game.time.id);
            this.game.time.id = null;
        }
    }

    addFoundWord() {
        const word = this.selection.word.text;
        this.game.words.count++;
        this.game.words.found[word.length].add(word);
        this.game.words.length[word.length]++;
        this.game.score += config.POINTS[word.length];
        if (word.length > this.game.words.longest.length) {
            this.game.words.longest = word;
        }
    }

    /*................GAME................*/

    addSelectedCell() {
        const { word, path } = this.selection;
        const { current, previous } = this.selection.cell;
        const { cells, words } = this.game;
        path.indices.push(current.index);
        word.text += current.data.letter;
        word.valid = words.valid[word.text.length]?.has(word.text);
        word.found = words.found[word.text.length]?.has(word.text);
        if (word.valid) {
            const points = config.POINTS[word.text.length];
            word.points = points;
            word.fontWeight = 500;
            word.color = config.COLOR.WORD.VALID.TEXT;
            path.color = config.COLOR.PATH.VALID;
            if (word.found) {
                word.textContent = word.text;
                word.backgroundColor = config.COLOR.WORD.DUPLICATE;
                current.data.color = config.COLOR.CELL.DUPLICATE;
            } else {
                word.textContent = `${word.text} (+${points})`;
                word.backgroundColor = config.COLOR.WORD.VALID.BACKGROUND;
                current.data.color = config.COLOR.CELL.VALID;
            }
        } else {
            word.backgroundColor = '';
            word.color = '';
            word.fontWeight = '';
            word.textContent = word.text;
            current.data.color = config.COLOR.CELL.SELECTED;
            path.color = '';
        }
        if (previous.data?.color === current.data.color) {
            path.targets = [current.index];
        } else {
            path.targets = path.indices;
            for (const cell of utils.iterator.pluck(cells, path.targets)) {
                cell.color = current.data.color
            }
        }
        previous.index = current.index;
        previous.data = current.data;
    }
}
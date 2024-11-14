import { config } from './config.js'
import { utils } from './utils.js'
import { API } from './API.js'
import { Storage } from './Storage.js'


export class Model {
    constructor() {
        this.api = new API();
        this.storage = new Storage();
        this.ui = {
            loading: false,
            screen: 'home',
            mode: '',
            message: null,
        };
        this.user = this.storage.getUser();
        this.resetGame();
    }


    /*................UI................*/

    resetLoading() {
        this.ui.loading = false;
    }

    setMode(mode) {
        this.ui.loading = true;
        this.ui.mode = mode;
        this.resetGame();
    }

    setCurrentScreen(screen) {
        this.ui.screen = screen;
    }


    /*................INPUTS................*/

    resetMessage() {
        this.ui.message = null;
    }

    setFormError(userName) {
        if (userName) {
            this.setErrorMessage('username has outer spaces');
        } else {
            this.setErrorMessage('username is empty');
        }
    }

    setErrorMessage(text) {
        this.ui.message = {
            color: config.COLOR.ERROR,
            borderColor: config.COLOR.ERROR,
            class: 'icon-error',
            error: true,
            text: text,
        };
    }

    setWarningMessage(text) {
        this.ui.message = {
            color: config.COLOR.WARNING,
            borderColor: config.COLOR.WARNING,
            class: 'icon-warning',
            error: true,
            text: text,
        };
    }

    setSuccessMessage(text) {
        this.ui.message = {
            color: config.COLOR.SUCCESS,
            borderColor: '',
            class: 'icon-checkmark',
            error: false,
            text: text,
        };
    }

    async setUserName(userName) {
        if (userName === this.user.name) return
        if (this.user.id) {
            await this.updateUserName(userName);
        } else {
            await this.createNewUser(userName);
        }
    }

    async updateUserName(userName) {
        const data = await this.api.updateUserName(this.user.id, userName);
        if (data?.error) {
            this.setErrorMessage(data.error);
        } else {
            this.user.name = userName;
            this.storage.setUserName(this.user.name);
            this.setSuccessMessage('username changed successfully');
        }
    }

    async createNewUser(userName) {
        const data = await this.api.createNewUser(userName);
        if (data?.error) {
            this.setErrorMessage(data.error);
        } else {
            this.user.id = data['user_id'];
            this.storage.setUserId(this.user.id);
            this.user.name = userName;
            this.storage.setUserName(this.user.name);
            this.setSuccessMessage('user created successfully');
        }
    }

    async addFriend(userName) {
        const friends = this.user.friends;
        if (friends.names.has(userName)) {
            const index = friends.order.findIndex((friend) => friend.userName === userName);
            const [friend] = friends.order.splice(index, 1);
            friends.order.unshift(friend);
            this.storage.setFriendsOrder(friends.order);
            this.setSuccessMessage(`you're already friends`);
            return
        }
        if (userName === this.user.name) {
            this.setWarningMessage(`that's your username`)
            return
        }
        const data = await this.api.fetchUserId(userName);
        if (data?.error) {
            this.setErrorMessage(data.error);
        } else {
            const userId = data['user_id'];
            friends.order.unshift({ userId, userName });
            friends.ids.add(userId);
            friends.names.add(userName);
            this.storage.setFriends(friends);
            this.setSuccessMessage('friend added successfully');
        }
    }


    /*................GAME................*/

    resetGame() {
        this.game = {
            score: 0,
            words: {
                count: 0,
                longest: '',
                valid: utils.object.createObject(13, (i) => i + 3, () => null),
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
            selection: null,
        };
        this.resetSelection();
    }

    resetSelection() {
        this.game.selection = {
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

    async initializeGameData() {
        const { board, words } = await this.api.fetchNewGameData();
        for (let i = 3; i < 16; i++) {
            this.game.words.valid[i] = new Set(words[i]);
        }
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const column = i % 4;
            this.game.cells[i].row = row + 1;
            this.game.cells[i].column = column + 1;
            this.game.cells[i].letter = board[row][column];
        }
    }

    startTimer(updateTimerDisplay) {
        this.updateTimer(updateTimerDisplay);
        this.game.time.id = setInterval(() => this.updateTimer(updateTimerDisplay), 1000);
    }

    updateTimer(updateTimerDisplay) {
        this.game.time.remaining--;
        this.game.time.text = utils.string.secondsToMSS(this.game.time.remaining);
        this.game.time.color = this.game.time.remaining < 10
            ? config.COLOR.WARNING
            : '';
        updateTimerDisplay();
        if (this.game.time.remaining === 0) {
            clearInterval(this.game.time.id);
            this.game.time.id = null;
        }
    }

    startSelection() {
        this.game.selection.selecting = true;
    }

    updateTargetCell(index) {
        const { current, previous } = this.game.selection.cell;
        current.index = index;
        current.data = this.game.cells[index];
        if (current.data.color !== '') {
            // cell is already selected
            current.valid = false;
        } else if (!previous.data) {
            // cell is the first selected
            current.valid = true;
        } else {
            // cell is within one space of previous
            const rowDifference = Math.abs(current.data.row - previous.data.row);
            const columnDifferent = Math.abs(current.data.column - previous.data.column);
            current.valid = rowDifference <= 1 && columnDifferent <= 1
        }
    }

    addSelectedCell() {
        const { word, path } = this.game.selection;
        const { current, previous } = this.game.selection.cell;
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

    addFoundWord() {
        const words = this.game.words;
        const word = this.game.selection.word;
        words.count++;
        words.found[word.text.length].add(word.text);
        words.length[word.text.length]++;
        this.game.score += config.POINTS[word.text.length];
        if (word.text.length > words.longest.length) {
            this.game.words.longest = word.text;
        }
    }
}
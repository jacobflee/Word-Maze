import { Animations } from "./Animations.js"


export class Presenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.animations = new Animations(view);
        this.initializeEventHandlers();
        this.setUserName();
    }

    initializeEventHandlers() {
        // RESIZE
        window.addEventListener('resize', () => this.view.setAppHeight());

        // HOME
        this.addEventListeners(
            this.view.homeBtns,
            'click',
            () => this.view.switchToHomeScreen()
        );

        // USERNAME
        this.view.userNameInput.addEventListener('input', () => this.view.setUserNameWidth());
        this.view.userNameForm.addEventListener('submit', (event) => this.updateUserName(event));
        this.addEventListeners(
            window,
            ['touchend', 'mouseup'],
            () => this.hideInputErrors()
        );

        // MODES
        this.addEventListeners(
            this.view.modeSelectBtns,
            'click',
            (event) => this.startMode(event)
        );

        // FRIEND
        this.view.searchForm.addEventListener('submit', (event) => this.searchFriend(event));

        // GAME
        this.addEventListeners(
            this.view.touchTargets,
            ['mousedown', 'mousemove', 'touchstart', 'touchmove'],
            (event) => this.handleCellInteraction(event)
        );
        this.addEventListeners(
            window,
            ['touchcancel', 'touchend', 'mouseup'],
            () => this.endSelection()
        );

        // RESULTS
        this.view.resultsBtn.addEventListener('click', () => this.displayResults());
    }

    addEventListeners(elements, events, handler) {
        if (!elements.forEach) elements = [elements];
        if (!events.forEach) events = [events];
        elements.forEach((element) => {
            events.forEach((event) => {
                element.addEventListener(event, handler);
            });
        });
    }


    /*................HOME................*/

    setUserName() {
        const userName = this.model.getUserName();
        this.view.setUserName(userName);
    }

    async updateUserName(event) {
        event.preventDefault();
        const userName = event.currentTarget.userName.value;
        await this.model.setUserName(userName);
        console.log(this.model.userId, this.model.userNameValid);
        // if (userNameValid) {
        //     this.view.blurActiveElement();
        // } else {
        //     this.view.showInputErrors();
        // }
    }

    hideInputErrors() {
        this.view.hideInputErrors();
    }

    // TODO: do some sort of spooling animation when waiting for game data
    async startMode(event) {
        if (this.model.loading) return;
        this.model.setLoading(true);
        const button = event.currentTarget;
        this.view.setButtonAsLoading(button);
        this.model.gameState.reset();
        switch (button.dataset.mode) {
            case 'Timed':
                await this.initializeGameData();
                this.view.selectTimedMode();
                this.startTimer();
                break;
            case 'Free Play':
                await this.initializeGameData();
                this.view.selectFreePlayMode();
                break;
            case 'VS Friend':
                if (this.model.getUserName() === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.view.selectVSFriendMode();
                }
                break;
            case 'VS Random':
                if (this.model.getUserName() === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.view.selectVSRandomMode();
                }
                break;
        }
        this.view.resetButton(button);
        this.model.setLoading(false);
    }

    async initializeGameData() {
        await this.model.getGameBoard();
        this.model.selectionState.board.forEach((cell, i) => this.view.setLetterText(cell.letter, i));
    }


    /*................FRIEND................*/

    searchFriend(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
        console.log(userName);
        // TODO: show either friend card with an add friend button or no friend found
    }


    /*................GAME................*/

    startTimer() {
        this.model.gameState.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        const { text, color, seconds } = this.model.gameState.time;
        this.view.updateTimer(text, color);
        if (seconds === 0) this.displayResults();
    }

    handleCellInteraction(event) {
        const start = ['mousedown', 'touchstart'].includes(event.type);
        if (start) this.model.selectionState.start();
        const selecting = this.model.selectionState.selecting;
        if (!selecting) return;
        if (event.type === 'touchmove') {
            var touchTarget = this.view.getElementAtTouchPoint(event.touches[0]);
            if (touchTarget?.className !== 'touch-target') return;
        } else
            var touchTarget = event.currentTarget;
        const targetCell = touchTarget.parentElement;
        const index = targetCell.dataset.index;
        this.model.selectionState.updateTargetCell(targetCell, index);
        if (!this.model.selectionState.cell.valid) return;
        this.animations.cellSelection(this.model.selectionState.cell.current.element.firstElementChild);
        this.drawPath();
        this.model.addSelectedCell();
        const word = this.model.selectionState.word;
        const path = this.model.selectionState.path;
        const cell = this.model.selectionState.cell.current;
        this.view.updateSelectedLetters(word, path, cell);
    }

    drawPath() {
        this.drawSelectionCircle();
        if (this.model.selectionState.cell.previous.row) this.drawConnectionLine();
    }

    drawSelectionCircle() {
        const current = this.model.selectionState.cell.current;
        const [cx, cy] = this.getCellCenter(current.element);
        const r = current.element.clientWidth / 14.5;
        this.view.createSelectionCircle(cx, cy, r);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.selectionState.cell;
        const strokeWidth = current.element.clientWidth / 6.5;
        const [x1, y1] = this.getCellCenter(previous.element);
        const [x2, y2] = this.getCellCenter(current.element);
        this.view.createConnectionLine(strokeWidth, x1, y1, x2, y2);
    }

    getCellCenter(element) {
        const x = element.offsetLeft + element.clientWidth / 2;
        const y = element.offsetTop + element.clientHeight / 2;
        return [x, y];
    }

    endSelection() {
        const selecting = this.model.selectionState.selecting;
        if (!selecting) return;
        const word = this.model.selectionState.word;
        const path = this.model.selectionState.path;
        if (word.valid && !word.found) {
            const { game, words } = this.model.gameState;
            this.animations.scoreIncrease(game.score, word.points);
            this.model.addFoundWord();
            this.view.updateWordCount(words.count);
        }
        this.animations.wordFadeOut();
        this.view.resetLetterPathAndSelectedCells(path.elements);
        this.model.reset();
    }


    /*................RESULTS................*/

    displayResults() {
        const { game, words } = this.model.gameState;
        this.view.displayResults(game.score, words.longest);
        if (words.count === 0)
            for (let i = 0; i < 13; i++) this.view.updateChartBar(i, '0%', '0');
        else
            this.animations.barGraph(words);
    }
}
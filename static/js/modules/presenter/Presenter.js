import { Animations } from "./Animations.js"


export class Presenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.animations = new Animations(view);
        this.initializeEventHandlers();
        this.setUsername();
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
        this.view.usernameInput.addEventListener('input', () => this.view.setUsernameWidth());
        this.view.usernameForm.addEventListener('submit', (event) => this.updateUsername(event));
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

    setUsername() {
        const username = this.model.getUsername();
        this.view.setUsername(username);
    }

    async updateUsername(event) {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        await this.model.setUsername(username);
        console.log(this.model.userId, this.model.usernameValid);
        // if (usernameValid) {
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
                if (this.model.getUsername() === '') {
                    this.view.usernameInput.focus();
                } else {
                    this.view.selectVSFriendMode();
                }
                break;
            case 'VS Random':
                if (this.model.getUsername() === '') {
                    this.view.usernameInput.focus();
                } else {
                    this.view.selectVSRandomMode();
                }
                break;
        }
        this.view.resetButton(button);
        this.model.setLoading(false);
    }

    async initializeGameData() {
        const gameboard = await this.model.getGameboard();
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const letter = gameboard[row][col]
            this.view.setLetterText(i, letter);
        }
    }


    /*................FRIEND................*/

    searchFriend(event) {
        event.preventDefault();
        const username = event.currentTarget.username.value;
        console.log(username);
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
        this.model.selectionState.updateTargetCell(touchTarget.parentElement);
        const current = this.model.selectionState.current;
        if (!current.cell.valid) return;
        this.animations.cellSelection(current.cell.element.firstElementChild);
        this.drawPath();
        this.model.addSelectedCell(current.cell.element);
        this.view.updateSelectedLetters(current);
    }

    drawPath() {
        const previous = this.model.selectionState.previous;
        this.drawSelectionCircle();
        if (previous.cell.row) this.drawConnectionLine();
    }

    drawSelectionCircle() {
        const current = this.model.selectionState.current;
        const [cx, cy] = this.getCellCenter(current.cell.element);
        const r = current.cell.element.clientWidth / 14.5;
        this.view.createSelectionCircle(cx, cy, r);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.selectionState;
        const strokeWidth = current.cell.element.clientWidth / 6.5;
        const [x1, y1] = this.getCellCenter(previous.cell.element);
        const [x2, y2] = this.getCellCenter(current.cell.element);
        this.view.createConnectionLine(strokeWidth, x1, y1, x2, y2);
    }

    getCellCenter(element) {
        const x = element.offsetLeft + element.clientWidth / 2;
        const y = element.offsetTop + element.clientHeight / 2;
        return [x, y];
    }

    endSelection() {
        const { selecting, current } = this.model.selectionState;
        if (!selecting) return;
        const { word, path } = current;
        if (word.valid && !word.found) {
            const { score, words } = this.model.gameState;
            this.animations.scoreIncrease(score, word.points);
            this.model.addFoundWord();
            this.view.updateWordCount(words.count);
        }
        this.animations.wordFadeOut();
        this.view.resetLetterPathAndSelectedCells(path.elements);
        this.model.selectionState.reset();
    }


    /*................RESULTS................*/

    displayResults() {
        const { score, words } = this.model.gameState;
        this.view.displayResults(score, words.longest);
        if (words.count === 0)
            for (let i = 0; i < 13; i++) this.view.updateChartBar(i, '0%', '0');
        else
            this.animations.barGraph(words);
    }
}
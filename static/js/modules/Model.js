export const Model = (() => {
    const POINTS = {
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

    const COLORS = {
        DUPLICATE: 'rgb(220, 220, 40)',
        VALID: 'rgb(20, 180, 40)',
        SELECTED: 'rgb(40, 80, 240)'
    };

    let gameState;

    function init() {
        resetGameState();
    }

    function resetGameState() {
        gameState = {
            currentWordString: '',
            isSelecting: false,
            lastSelectedColumn: -1,
            lastSelectedRow: -1,
            selectedCells: [],
            wordCount: 0,
            foundWords: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, new Set()])),
            wordLengthDistribution: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, 0])),
            score: 0,
            validWords: {},
            secondsRemaining: 4,
            longestWord: '',
        };
    }

    function getGameState() {
        return gameState;
    }

    function decrementSecondsRemaining() {
        gameState.secondsRemaining--;
    }

    function updateValidWords(words) {
        gameState.validWords = Object.fromEntries(
            Object.entries(words).map(([key, value]) => [key, new Set(value)])
        );
    }

    function setIsSelecting(value) {
        gameState.isSelecting = value;
    }

    function addSelectedCell(cell) {
        gameState.selectedCells.push(cell);
    }

    function addToCurrentWordString(letter) {
        gameState.currentWordString += letter;
    }

    function updateLastSelectedPosition(cell) {
        gameState.lastSelectedRow = cell.style.gridRowStart;
        gameState.lastSelectedColumn = cell.style.gridColumnStart;
    }

    function addFoundWord() {
        const word = gameState.currentWordString;
        gameState.foundWords[word.length].add(word);
        gameState.wordLengthDistribution[word.length]++;
    }

    function updateLongestWord() {
        gameState.longestWord = gameState.currentWordString;
    }

    function incrementWordCount() {
        gameState.wordCount++;
    }

    function increaseScore(points) {
        gameState.score += points;
    }

    function resetCellSelection() {
        gameState.currentWordString = '';
        gameState.isSelecting = false;
        gameState.lastSelectedColumn = -1;
        gameState.lastSelectedRow = -1;
        gameState.selectedCells = [];
    }

    return {
        POINTS,
        COLORS,
        init,
        resetGameState,
        getGameState,
        decrementSecondsRemaining,
        updateValidWords,
        setIsSelecting,
        addSelectedCell,
        addToCurrentWordString,
        updateLastSelectedPosition,
        addFoundWord,
        incrementWordCount,
        increaseScore,
        resetCellSelection,
        updateLongestWord,
    };
})();
export const config = (() => {
    const COLOR = {
        CELL: {
            SELECTED: '#25E',
            VALID: '#1B2',
            DUPLICATE: '#DD2',
        },
        PATH: {
            SELECTED: '#F00',
            VALID: '#FFF',
        },
        WORD: {
            VALID: {
                BACKGROUND: '#1B2',
                TEXT: '#000',
            },
            DUPLICATE: '#DD2',
        },
        SCORE: '#FF0',
        CHART: '#39D',
        ERROR: '#F00',
        WARNING: '#FA0',
        SUCCESS: '#0D2',
        BACKGROUND: {
            PRIMARY: '#000',
            SECONDARY: '#126',
        },
        HIGHLIGHT: {
            PRIMARY: '#0BD',
        },
        TEXT: {
            PRIMARY: '#FFF',
            SECONDARY: '#888',
        },
    };

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
        15: 15800,
    };

    const DURATION = {
        GAME: 91,
        ANIMATION: {
            MESSAGE: 18,
            CELL: 12,
            WORD: 12,
            SCORE: 28,
            GRAPH: 120,
        },
    };

    return { COLOR, POINTS, DURATION }
})()
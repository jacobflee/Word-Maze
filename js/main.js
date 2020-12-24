import { initializeGrid } from './grid.js';
import { initializeWords } from './wordsFound.js';
import './input.js';

const gameNumber = 1; // + Math.floor(100 * Math.random());
const url = "./assets/jsons/" + gameNumber + ".json";
fetch(url)
    .then(response => response.json())
    .then(data => {
        initializeGrid(data.board);
        initializeWords(data.words);
    });
const wordsFoundElement = document.getElementById('words-found');
var wordsFound = [];
var wordStarts;

export function addWordFound(word) {
    wordsFound.push(word);
    const wordFoundElement = document.createElement('div');
    wordFoundElement.className = 'word-found';
    wordFoundElement.innerHTML = word;
    wordsFoundElement.appendChild(wordFoundElement);
}

export function wordNotFound(word) {
    return !wordsFound.includes(word);
}

export function isWord(word) {
    return wordStarts[word.length - 3] && wordStarts[word.length - 3].includes(word);
}

export function initializeWords(words) {
    wordStarts = words;
}
const wordCurrentElement = document.getElementById('word-current');
var wordCurrent = '';

export function addLetter(letter) {
    wordCurrent += letter;
    wordCurrentElement.innerHTML = wordCurrent;
}

export function clearWord() {
    wordCurrent = '';
    wordCurrentElement.innerHTML = wordCurrent;
}

export function getWord() {
    return wordCurrent;
}
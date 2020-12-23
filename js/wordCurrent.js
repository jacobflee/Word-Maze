const wordCurrentElement = document.getElementById('word-current');
var wordCurrent = '';

export function addLetter(letter) {
    wordCurrent += letter;
}

export function updateCurrentWord(color, value) {
    wordCurrentElement.style.backgroundColor = color;
    if (color === '') {
        wordCurrentElement.style.color = 'white';
        wordCurrentElement.style.fontWeight = '';
    } else {
        wordCurrentElement.style.color = 'black';
        wordCurrentElement.style.fontWeight = 500;
    }
    if (value > 0)
        wordCurrentElement.innerHTML = wordCurrent + ' (+' + value + ')';
    else
        wordCurrentElement.innerHTML = wordCurrent;
}

export function clearWord() {
    wordCurrentElement.style.backgroundColor = 'black';
    wordCurrentElement.style.color = 'white';
    wordCurrent = '';
    wordCurrentElement.innerHTML = '<br />';
}

export function getWord() {
    return wordCurrent;
}
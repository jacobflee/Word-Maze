const wordElement = document.getElementById('word-current');
var wordCurrent = '';

function fadeWord(opacity) {
    if (opacity > 0) {
        wordElement.style.opacity = opacity;
        setTimeout(() => fadeWord(opacity - 0.05), 1);
    } else {
        wordElement.style.backgroundColor = '';
        wordElement.style.color = '';
        wordElement.innerHTML = '<br />';
        wordElement.style.opacity = '';
    }
}

export function addLetter(letter) {
    wordCurrent += letter;
}

export function setWord(color, value) {
    if (color === '') {
        wordElement.style.backgroundColor = '';
        wordElement.style.color = '';
        wordElement.style.fontWeight = '';
    } else {
        wordElement.style.backgroundColor = color;
        wordElement.style.color = 'black';
        wordElement.style.fontWeight = 500;
    }
    if (value > 0)
        wordElement.innerHTML = wordCurrent + ' (+' + value + ')';
    else
        wordElement.innerHTML = wordCurrent;
}

export function clearWord() {
    wordCurrent = '';
    fadeWord(1);
}

export function getWord() {
    return wordCurrent;
}
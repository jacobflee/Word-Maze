import { releaseCells } from './grid.js';

window.addEventListener('mouseup', releaseCells);
window.addEventListener('touchend', releaseCells);
window.addEventListener('touchcancel', releaseCells);
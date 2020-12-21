import { press, release } from './grid.js';

window.addEventListener('mousedown', e => {
    press(e);
    window.addEventListener('mousemove', press);
});

window.addEventListener('mouseup', () => {
    release();
    window.removeEventListener('mousemove', press);
});

window.addEventListener('touchstart', press);

window.addEventListener('touchmove', press);

window.addEventListener('touchend', release);

window.addEventListener('touchcancel', release);
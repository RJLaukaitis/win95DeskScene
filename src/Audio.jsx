let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let clickBuffer;
import click from '../Assets/Audio/MouseClick.wav';

fetch(click)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(buffer => clickBuffer = buffer)
    .catch(e => console.error('Error loading audio file', e));

const playMouseClick = () => {
    if (clickBuffer) {
        let source = audioContext.createBufferSource();
        source.buffer = clickBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
};
window.addEventListener('mousedown', playMouseClick);
import { useState, useEffect } from 'react';

const playTypingSound = () => {
    const audio = new Audio('../../Assets/Audio/ticker.mp3');
    audio.volume = 0.5;
    audio.play();
};

const Typewriter = ({ text, delay, infinite, onComplete, onCompleteSound }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timeout;

        if (currentIndex < text.length) {
            timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
                playTypingSound();
            }, delay);
        } else if (infinite) {
            setCurrentIndex(0);
            setCurrentText('');
        } else if (onComplete) {
            if (onCompleteSound) {
                onCompleteSound();
            }
            onComplete();
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, delay, infinite, text, onComplete, onCompleteSound]);

    return <span>{currentText}</span>;
};

export default Typewriter;

import React, { useEffect, useState } from 'react';
import './Ui.css';

const Ui = () => {
    const [time, setTime] = useState('');
    const [typedName, setTypedName] = useState('');
    const [typedInfo, setTypedInfo] = useState('');
    const [typedClickBox, setTypedClickBox] = useState('');

    const playTypingSound = () => {
        const audio = new Audio('../../Assets/Audio/Typing.mp3');
        audio.volume = 0.1;
        audio.play();
    };

    useEffect(() => {
        const startTime = () => {
            const today = new Date();
            const hours = String(today.getHours()).padStart(2, '0');
            const minutes = String(today.getMinutes()).padStart(2, '0');
            const seconds = String(today.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);
        };

        const timer = setInterval(startTime, 1000);
        startTime();

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const textName = 'Ronald Laukaitis';
        const textInfo = 'Lehigh University Student';
        const textClickBox = 'Click anywhere to continue.';

        const typeEffect = (text, setTypedState) => {
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    setTypedState(prev => prev + text[index]);
                    playTypingSound();
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 100);
        };

        setTypedName('');
        setTypedInfo(''); 
        setTypedClickBox('');

        typeEffect(textName, setTypedName);
        setTimeout(() => typeEffect(textInfo, setTypedInfo), textName.length * 100 + 500);
        setTimeout(() => typeEffect(textClickBox, setTypedClickBox), textName.length * 100 + textInfo.length * 100 + 1000);
    }, []);

    return (
        <div className='ui-container'>
            <div className='clickBox'>
                <p>{typedClickBox}</p>
            </div>

            <div className='panel'>
                <div className='info'>
                    <p>{typedName}</p>
                    <p>{typedInfo}</p>
                </div>
                
                <div className='time'>
                    <p>{time}</p>
                </div>
            </div>
        </div>
    );
};

export default Ui;

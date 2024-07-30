import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './ui.css';

const playTypingSound = () => {
    const audio = new Audio('../../Assets/Audio/ticker.mp3');
    audio.volume = 0.3;
    audio.play();
};

const Ui = () => {
    const [time, setTime] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [showName, setShowName] = useState(false);
    const [showPosition, setShowPosition] = useState(false);
    const [showTime, setShowTime] = useState(false);

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

    const handleClick = () => {
        setShowInfo(true);
        setShowName(true);
    };

    return (
        <div className='ui-container' onClick={!showInfo ? handleClick : null}>
            <div className='clickBox'>
                {!showInfo && (
                    <TypeAnimation
                        sequence={['Click anywhere to continue.']}
                        wrapper="span"
                        speed={1}
                        style={{ fontSize: '1.2em', display: 'inline-block' }}
                        repeat={0}
                        onCharacterTyped={() => playTypingSound()}
                    />
                )}
            </div>
            {showInfo && (
                <div className='panel'>
                    {showName && (
                        <div className='name-box'>
                            <TypeAnimation
                                cursor={false}
                                sequence={['Ronald Laukaitis', () => setShowPosition(true)]}
                                wrapper="span"
                                speed={1}
                                style={{ fontSize: '14px', display: 'inline-block' }}
                                repeat={0}
                                onCharacterTyped={() => playTypingSound()}
                            />
                        </div>
                    )}
                    {showPosition && (
                        <div className='position-box'>
                            <TypeAnimation
                                cursor={false}
                                sequence={['Lehigh University Student', () => setShowTime(true)]}
                                wrapper="span"
                                speed={1}
                                style={{ fontSize: '14px', display: 'inline-block' }}
                                repeat={0}
                                onCharacterTyped={() => playTypingSound()}
                            />
                        </div>
                    )}
                    {showTime && (
                        <div className='time-box'>
                            <span style={{ fontSize: '12px', display: 'inline-block', backgroundColor: 'black', color: 'white', padding: '10px' }}>{time}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Ui;

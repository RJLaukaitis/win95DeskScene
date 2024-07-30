import React, { useEffect, useState } from 'react';
import Typewriter from './Typewriter';
import soundIcon from '../../Assets/Ui_images/sound.png';
import mutedIcon from '../../Assets/Ui_images/muted.png';
import './ui.css';

const Ui = ({ zoomStateRef }) => {
  const [time, setTime] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleOverlayClick = () => {
    setShowInfo(true);
    setShowName(true);
  };

  const playCompletionSound = () => {
    const audio = new Audio('../../Assets/Audio/ticker.mp3');
    audio.volume = 0.3;
    audio.play();
  };

  useEffect(() => {
    if (showTime) {
      playCompletionSound();
      setTimeout(() => {
        setShowSound(true);
      }, 500);
    }
  }, [showTime]);

  const handleSoundToggle = (event) => {
    event.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className={`ui-container ${zoomStateRef.current ? 'ui-fade-out' : ''}`}>
      {!showInfo && (
        <>
          <div className='overlay' onClick={handleOverlayClick}></div>
          <div className='clickBox'>
            <Typewriter
              text="Click anywhere to continue."
              delay={100}
            />
          </div>
        </>
      )}
      {showInfo && (
        <div className='panel'>
          {showName && (
            <div className='name-box'>
              <Typewriter
                text="Ronald Laukaitis"
                delay={100}
                onComplete={() => setShowPosition(true)}
              />
            </div>
          )}
          {showPosition && (
            <div className='position-box'>
              <Typewriter
                text="Lehigh University Student"
                delay={100}
                onComplete={() => setShowTime(true)}
              />
            </div>
          )}
          {showTime && (
            <div className='time-sound-container'>
              <div className='time-box'>
                <span style={{ fontSize: '1em', display: 'inline-block', backgroundColor: 'black', color: 'white', padding: '5px 10px', boxSizing: 'border-box' }}>{time}</span>
              </div>
              {showSound && (
                <div className='sound-box' onClick={handleSoundToggle}>
                  <img
                    src={isMuted ? mutedIcon : soundIcon}
                    alt="sound-icon"
                    style={{ width: '14px', height: '14px' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ui;

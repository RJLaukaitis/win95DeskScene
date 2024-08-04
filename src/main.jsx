import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom';
import CSS3DScene from './CSS3DScene';
import WelcomePage from './WelcomePage';
import './app.css';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = () => {
    if (!loading) {
      setFadeOut(true);
      setTimeout(() => {
        setShowWelcome(false);
      }, 1500);
    }
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!showWelcome) {
      setFadeOut(false);
    }
  }, [showWelcome]);

  return (
    <>
      {showWelcome ? (
        <div className={`welcome-container ${fadeOut ? 'fade-out' : ''}`}>
          <WelcomePage
            onEnter={handleEnter}
            onLoadingComplete={handleLoadingComplete}
          />
        </div>
      ) : (
        <div className="canvas-container">
          <Canvas
            camera={{
              fov: 39,
              near: 0.1,
              far: 2000,
            }}
          >
            <CSS3DScene onLoadingComplete={handleLoadingComplete}/>
          </Canvas>
        </div>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;

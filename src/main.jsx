import React, {useEffect, useState,useRef  } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom';
import CSS3DScene from './CSS3DScene';
import WelcomePage from './WelcomePage';


import './app.css';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [model, setModel] = useState(null);


  const handleEnter = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome ? (
        <WelcomePage onEnter={handleEnter} setModel={setModel} />
      ) : (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
          <Canvas
            camera={{
              fov: 39,
              near: 0.1,
              far: 2000,
            }}
          >
            {model && <primitive object={model} />}
            <CSS3DScene />
          </Canvas>
        </div>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

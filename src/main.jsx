import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import CSS3DScene from './CSS3DScene';
import WelcomePage from './WelcomePage';
import Ui from './UserInterface/Ui'

import './app.css';
import { Environment } from '@react-three/drei';
import FilmGrainEffect from './grainShader/FilmGrainEffect';

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
        <Canvas
          camera={{
            fov: 39,
            near: 0.1,
            far: 2000,
          }}
        >
          {model && <primitive object ={model} />}
          <CSS3DScene />
        </Canvas>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

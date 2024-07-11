import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import CSS3DScene from './CSS3DScene';
import WelcomePage from './WelcomePage';
import './app.css';
import { Environment } from '@react-three/drei';

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
            position: [30, 9, -30], // Adjust as needed
          }}
        >
          {model && <primitive object ={model} />}
          <CSS3DScene />
          <ambientLight intensity={1}/>
        </Canvas>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

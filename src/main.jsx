import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import CSS3DScene from './CSS3DScene';
import WelcomePage from './WelcomePage';
import './app.css';
import { Environment } from '@react-three/drei';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnter = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome ? (
        <WelcomePage onEnter={handleEnter} />
      ) : (
        <Canvas
          camera={{
            fov: 39,
            near: 0.1,
            far: 2000,
            position: [10, 9, -14], // Adjust as needed
          }}
        >
          <CSS3DScene />
          {/* <Environment preset = "lobby"/> */}
        </Canvas>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

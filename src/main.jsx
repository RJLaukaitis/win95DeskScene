import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import ReactDOM from 'react-dom/client';
import CSS3DScene from './CSS3DScene';
import './App.css';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const { progress } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false);
    }
  }, [progress]);

  return (
    <>
      {loading && <LoadingScreen />}
      <Canvas
        camera={{
          fov: 39,
          near: 0.1,
          far: 2000,
          position: [10, 9, -14], //11,9,-15
        }}
      >
        <CSS3DScene />
      </Canvas>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
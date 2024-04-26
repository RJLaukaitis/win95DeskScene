import { Canvas, useThree } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Desk from "./Desk.jsx";
import "./App.css"
import { useEffect } from 'react';

const Scene = () => {
  const { camera } = useThree();

  useEffect(() => {
    // Adjust this to the position of your desk or where you want to focus.
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return <Desk />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [-3, 1.5, 4]
    }}
  >
    <Scene />
  </Canvas>
);

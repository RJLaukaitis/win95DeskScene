import { Canvas, useThree, extend, useLoader } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Desk from "./Desk.jsx";
import "./App.css"
import { useEffect } from 'react';
import { AmbientLight, DirectionalLight, TextureLoader } from 'three';

const Scene = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    // Adjust camera focus as needed
    camera.lookAt(-8, 2.7,0);
    camera.updateProjectionMatrix();

    // Setup lighting
    const ambientLight = new AmbientLight(0x404040, 1); // Soft white light
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);
  }, [camera, scene]);

  return <Desk />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Canvas
    camera={{
      fov: 39,
      near: 0.1,
      far: 2000,
      position: [1.3, 3, .1]
    }}
  >
    <Scene />
  </Canvas>
);

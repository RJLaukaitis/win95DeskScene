import { Canvas, useThree, extend, useLoader } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Desk from "./Desk.jsx";
import "./App.css"
import { useEffect } from 'react';
import { AmbientLight, DirectionalLight, TextureLoader } from 'three';
import CSS3DScene from './CSS3DScene.jsx';


const Scene = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
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
      position: [10, 10, 8]
    }}
  >
    <Scene />
    <CSS3DScene/>
  </Canvas>
);

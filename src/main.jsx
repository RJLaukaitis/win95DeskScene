import { Canvas, useThree, extend, useLoader } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'
import Desk from "./Desk.jsx";
import "./App.css"
import { useEffect } from 'react';
import { AmbientLight, DirectionalLight, TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

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
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [1.3, 3, .12]
    }}
  >
    <Scene />
    {/* <OrbitControls 
    enableZoom={false}
    enableRotate={false}
    enablePan={false}
    autoRotate autoRotateSpeed={1.0}
    /> */}
  </Canvas>
);

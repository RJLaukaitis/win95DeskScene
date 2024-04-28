import { Canvas, useThree, extend, useLoader } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';
import { AmbientLight, DirectionalLight } from 'three';
import "./App.css";
import Desk from "./Desk.jsx";
import CSS3DScene from './CSS3DScene.jsx';

const Scene = () => {
  const { camera, scene } = useThree();

  useEffect(() => {
    // Adjust camera focus and lighting as needed
    camera.lookAt(0, 2, 0);
    const ambientLight = new AmbientLight(0x404040, 1); // Soft white light
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);

    // Event listener for camera adjustment
    const adjustCamera = () => {
      camera.position.set(1.3, 3, 0.1);
      camera.lookAt(-8,2.7,0);
      camera.updateProjectionMatrix();
    };

    window.addEventListener('mousedown', adjustCamera);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('mousedown', adjustCamera);
    };
  }, [camera, scene]); // Ensure effect runs only when camera or scene changes

  return <Desk />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Canvas
    camera={{
      fov: 39,
      near: 0.1,
      far: 2000,
      position: [7, 11, 20]
    }}
  >
    <Scene />
    <CSS3DScene/>
  </Canvas>
);

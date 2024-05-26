import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import CSS3DScene from './CSS3DScene';
import './App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Canvas
    camera={{
      fov: 39,
      near: 0.1,
      far: 2000,
      position: [11, 9, -15],
    }}
  >
    <CSS3DScene />
  </Canvas>
);
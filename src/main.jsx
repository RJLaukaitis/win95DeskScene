import { Canvas, useThree, extend, useLoader } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { AmbientLight, DirectionalLight } from 'three';
import "./App.css";
import Desk from "./Desk.jsx";
import CSS3DScene from './CSS3DScene.jsx';
import gsap from 'gsap';


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
      OrbitControls.autoRotate =false;
      gsap.to(camera.position,{
        x: 1.3,y:3,z:0.1, duration:1, onUpdate:function() {
                        camera.lookAt(-1,2,0);
                        camera.lookAt(-3,2,0);
                        camera.lookAt(-8,2.7,0);

        }
      })
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
      position: [20, 9, 0]
    }}
  >
    <Scene />
     {/* <OrbitControls 
    enableZoom={false}
    enableRotate={false}
    enablePan={false}
    autoRotate autoRotateSpeed={1.0}
    /> */}
    <CSS3DScene/>
  </Canvas>
);

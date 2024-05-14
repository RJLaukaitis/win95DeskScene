import { useEffect } from 'react';
import { extend, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

function DeskModel() {
  const gltf = useLoader(GLTFLoader, '../Assets/DeskScene.glb');
  return <primitive object={gltf.scene} />;
}

function CSS3DScene() {
  const { scene, camera, gl } = useThree();

  useEffect(() => {
    // Film grain effect
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const filmPass = new FilmPass(0.1, 0.025, 648, false);

    composer.addPass(renderPass);
    composer.addPass(filmPass);

    const render = () => {
      composer.render();
      requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(render);
    };
  }, [camera, scene, gl]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.5} position={[5, 10, 5]} />
      <Environment preset="warehouse" />
      <DeskModel />
      {/* White box for containing elements */}
      <mesh position={[0, 22.5, 0]}>
        <boxGeometry args={[45, 45, 45]} />
        <meshStandardMaterial
          color={0xffffff}
          roughness={0.5}
          metalness={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[7.2, 6.4]} />
        <meshBasicMaterial opacity={0} transparent={true} depthWrite={true} depthTest={true} blending={THREE.NoBlending} />
        <Html transform>
          <iframe
            src="https://henryheffernan-os.vercel.app/about"
            width="720"
            height="640"
            style={{ border: 'none' }}
          />
        </Html>
      </mesh>
      <OrbitControls />
    </>
  );
}

export default CSS3DScene;
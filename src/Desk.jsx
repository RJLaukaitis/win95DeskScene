import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import { useSpring, a} from '@react-spring/three'

export default function Desk() {
    const desk = useGLTF("../Assets/DeskScene.glb");

    return (
        <mesh>
        <>
        <   Environment preset="warehouse" />
            {/* <PresentationControls global polar ={[0,0]} azimuth={[-Math.PI / 2, Math.PI/2 / 2]}> */}
            <primitive object={desk.scene}>
                {<Html wrapperClass="computer" 
                position={[-6, 4.8,2.1]}>
                    <iframe src= "https://www.bing.com"/>
                </Html>}
            </primitive>
            {/* </PresentationControls> */}
        </>
         </mesh>
    );
}


//implement this code
// import React, { useRef, useEffect } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { Environment, Html, useGLTF } from '@react-three/drei';
// import { useSpring, a } from '@react-spring/three';
// import * as THREE from 'three';
// import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

// // Constants
// const SCREEN_SIZE = { w: 1280, h: 1024 }; // Adjust as per your requirements

// const Desk = () => {
//     const desk = useGLTF("../Assets/DeskScene.glb");
//     const { scene, gl } = useThree();
//     const cssRendererRef = useRef(null);

//     useEffect(() => {
//         // Initialize CSS3D Renderer
//         cssRendererRef.current = new CSS3DRenderer();
//         cssRendererRef.current.setSize(window.innerWidth, window.innerHeight);
//         cssRendererRef.current.domElement.style.position = 'absolute';
//         cssRendererRef.current.domElement.style.top = '0';
//         document.body.appendChild(cssRendererRef.current.domElement);

//         // Call your custom methods here to add objects to the scene
//         const texture = new THREE.TextureLoader().load('path/to/your/texture.jpg');
//         addTextureLayer(scene, texture, 0.5, -0.1);

//         // Dummy iframe for demonstration
//         const iframe = document.createElement('iframe');
//         iframe.src = "https://www.bing.com";
//         iframe.style.width = '100%';
//         iframe.style.height = '100%';

//         createCssPlane(scene, cssRendererRef.current.scene, new THREE.Vector3(0, 0, 0), new THREE.Euler());

//         return () => {
//             // Cleanup
//             document.body.removeChild(cssRendererRef.current.domElement);
//         };
//     }, []);

//     // Use a click handler if needed
//     const handleDeskClick = (e) => {
//         // Logic to handle the click
//     };

//     return (
//         <Canvas>
//             <ambientLight intensity={0.5} />
//             <Environment preset="warehouse" />
//             <mesh onClick={handleDeskClick}>
//                 <primitive object={desk.scene} />
//             </mesh>
//         </Canvas>
//     );
// };

// export default Desk;

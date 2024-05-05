import React, { Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring, a} from '@react-spring/three'
import { PresentationControls } from '@react-three/drei';

export default function Desk() {
    const desk = useGLTF("../Assets/DeskScene.glb");
    return (
        <mesh>
        <>
        <   Environment preset="warehouse" />
        <PresentationControls global polar ={[0,0]} azimuth={[-Math.PI / 2, Math.PI/2 / 2]}>
            <primitive object={desk.scene}>
            </primitive>
            </PresentationControls>
            </>
         </mesh>
    );
}
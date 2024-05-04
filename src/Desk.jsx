import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring, a} from '@react-spring/three'
import { PresentationControls } from '@react-three/drei';

export default function Desk() {
    const desk = useGLTF("../Assets/DeskScene.glb");

    return (
        <mesh>
        <>
        <   Environment preset="warehouse" />
            <primitive object={desk.scene}>
            </primitive>
            </>
         </mesh>
    );
}
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';

export default function Desk() {
    const desk = useGLTF("../Assets/DeskScene.glb");

    return (
        <>
        <   Environment preset="warehouse" />
            <primitive object={desk.scene} />
        </>
    );
}
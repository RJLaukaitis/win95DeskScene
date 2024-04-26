import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, useGLTF } from '@react-three/drei';
import { useSpring, a} from '@react-spring/three'

const handleDeskClick = (event) => {
    const newPosition = [deskPosition.x, deskPosition.y + 1, deskPosition.z + 3];

        set({ position: newPosition });

};

export default function Desk() {
    const desk = useGLTF("../Assets/DeskScene.glb");

    return (
        <mesh>
            onClick = {(e) => handleDeskClick(e)}

        <>
        <   Environment preset="warehouse" />
            {/* <PresentationControls global polar ={[0,0]} azimuth={[-Math.PI / 2, Math.PI/2 / 2]}> */}
            <primitive object={desk.scene}>
                {/* <Html>

                </Html> */}
            </primitive>
            {/* </PresentationControls> */}
        </>
         </mesh>
    );
}
import { useEffect, useRef } from 'react';
import { extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import './CSS3DScene.css';

// Extend @react-three/fiber to recognize CSS3DRenderer
extend({ CSS3DRenderer });

function CSS3DScene() {
    const { scene, camera, gl } = useThree();
    const ref = useRef();

    useEffect(() => {
        // Setup the CSS3DRenderer
        const cssRenderer = new CSS3DRenderer();
        const screenPosition = new THREE.Vector3(0,3,5);
        cssRenderer.setSize(120, 100);
        cssRenderer.domElement.style.setProperty('position', 'absolute');
        cssRenderer.domElement.style.setProperty('top', '40%', 'important');
        cssRenderer.domElement.style.setProperty('left', '50%', 'important');
        document.body.appendChild(cssRenderer.domElement);

        // Create a test CSS3D object, aim to replace with the iframe containing the inner website
        const el = document.createElement('div');
        el.innerHTML = "<h1>TEST</h1>";
        const cssObject = new CSS3DObject(el);
        cssObject.position.copy(screenPosition);
        cssObject.rotateY(1)
        scene.add(cssObject);

        // Animation loop for CSS3D rendering
        const animate = () => {
            cssRenderer.render(scene, camera);
            ref.current = requestAnimationFrame(animate);
        };
        ref.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            scene.remove(cssObject);
        };
    }, [camera, scene, gl]);

    return null; // As this component does not render anything directly
}

export default CSS3DScene;

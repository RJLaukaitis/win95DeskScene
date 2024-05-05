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
    let cssscene;

    useEffect(() => {
        // Setup the CSS3DRenderer
        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.zIndex = '0';
        document.body.appendChild(cssRenderer.domElement);

        gl.domElement.style.position = "absolute";
        gl.domElement.style.top = "0";
        gl.domElement.style.zIndex = "10";

        // Create the iframe element
        const element = document.createElement("iframe");
        element.style.width = "720px"; // Adjusted to a standard video size
        element.style.height = "640px"; // Adjusted to a standard video size
        element.src = "https://www.Bing.com";
        element.style.border = 'none';

        const domObject = new CSS3DObject(element);
        domObject.position.set(-0.15, 2.98, 0.12); // Positioned to be visible in front of the camera
        domObject.rotation.y = Math.PI / 2; // Correct the rotation to face the camera
        domObject.scale.set(0.0012, 0.0012, 0.0011);
        scene.add(domObject);

        // WebGL plane for occluding CSS plane
        const createOccludingPlane = () => {
            const geometry = new THREE.PlaneGeometry(720, 640); // Match the iframe's aspect ratio
            const material = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                opacity: 0,
                transparent: true,
                blending: THREE.NoBlending,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(domObject.position);
            mesh.rotation.copy(domObject.rotation);
            mesh.scale.copy(domObject.scale);
            return mesh;
        }

        const occlusionMesh = createOccludingPlane();
        scene.add(occlusionMesh);

        // Animation loop for CSS3D rendering
        const animate = () => {
            ref.current = requestAnimationFrame(animate);
            gl.render(scene, camera);
            cssRenderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            scene.remove(domObject);
            scene.remove(occlusionMesh);
        };
    }, [camera, scene, gl]);

    return null; // As this component does not render anything directly
}

export default CSS3DScene;
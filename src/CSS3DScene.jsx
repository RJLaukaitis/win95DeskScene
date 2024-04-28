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
    let scene2;
    

    useEffect(() => {
        // Setup the CSS3DRenderer
    scene2 = new THREE.Scene();
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    document.body.appendChild(cssRenderer.domElement);

    // Rendering iframe
    var element = document.createElement("iframe");
    element.style.width = "10px"; // Adjusted to a standard video size
    element.style.height = "10px"; // Adjusted to a standard video size
    element.src = "https://www.youtube.com/embed/7FG7nTUYowQ?si=Fvu-8rg4wVTI5iGQ";
    var domObject = new CSS3DObject(element);
    domObject.position.set(-5, 2, 0); // Positioned to be visible in front of the camera
    domObject.rotation.y = Math.PI; // Adjust if necessary
    scene.add(domObject);

    var material = new THREE.MeshPhongMaterial({
        opacity: 0.2,
        color: new THREE.Color("black"),
        blending: THREE.NoBlending,
        side: THREE.DoubleSide,
        transparent: true
    });

    var geometry = new THREE.PlaneGeometry(10, 10); // Match the iframe's aspect ratio
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(domObject.position);
    mesh.rotation.copy(domObject.rotation);
    scene.add(mesh);

    // Animation loop for CSS3D rendering
    const animate = () => {
        requestAnimationFrame(animate);
        cssRenderer.render(scene, camera);
    };
    ref.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
        cancelAnimationFrame(ref.current);
        document.body.removeChild(cssRenderer.domElement);
        scene.remove(domObject);
        scene.remove(mesh);
    };
}, [camera, scene, gl]);

    return null; // As this component does not render anything directly
}

export default CSS3DScene;

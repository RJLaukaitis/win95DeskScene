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
    element.style.width = "720px"; // Adjusted to a standard video size
    element.style.height = "640px"; // Adjusted to a standard video size
    element.src = "https://www.bing.com";
    var domObject = new CSS3DObject(element);
    domObject.position.set(-.2, 3, .09); // Positioned to be visible in front of the camera
    domObject.rotation.y = 2*(-Math.PI / 2); // Correct the rotation to face the camera


    domObject.scale.set(.005,.005,.05);
    scene.add(domObject);

    var material = new THREE.MeshPhongMaterial({
        opacity: 0.2,
        color: new THREE.Color("black"),
        blending: THREE.NoBlending,
        side: THREE.DoubleSide,
        transparent: true
    });

    var geometry = new THREE.PlaneGeometry(90, 90); // Match the iframe's aspect ratio
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(domObject.position);
    mesh.rotation.copy(domObject.rotation);
    mesh.scale.copy(domObject.scale);
    scene.add(mesh);

    // Animation loop for CSS3D rendering
    const animate = () => {
        requestAnimationFrame(animate);
        cssRenderer.render(scene,camera);
    };
    ref.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
        cancelAnimationFrame(ref.current);
        document.body.removeChild(cssRenderer.domElement);
        scene.remove(domObject);
    };
}, [camera, scene, gl]);

    return null; // As this component does not render anything directly
}

export default CSS3DScene;
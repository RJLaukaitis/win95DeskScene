import { useEffect, useRef } from 'react';
import { extend, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment } from '@react-three/drei';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import './CSS3DScene.css';

extend({ CSS3DRenderer });

function CSS3DScene() {
    const { scene, camera } = useThree();
    const cssScene = new THREE.Scene();
    const ref = useRef();

    useEffect(() => {
        // Setting up gl renderer
        const glcontainer = document.createElement('div');
        glcontainer.id = 'webgl';
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        glcontainer.appendChild(renderer.domElement);
        document.body.appendChild(glcontainer);

        // Setup the CSS3DRenderer
        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = 0;
        cssRenderer.domElement.id = 'css3d';
        document.body.appendChild(cssRenderer.domElement);

        // Film grain
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        const filmPass = new FilmPass(
            0.1,   // noise intensity
            0.025, // scanline intensity
            648,   // scanline count
            false  // grayscale (set to true if you want grayscale)
        );

        composer.addPass(renderPass);
        composer.addPass(filmPass);

        // ORBIT CONTROLS
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(5, 10, 5);
        scene.add(ambientLight, directionalLight);

        // White box for containing elements
        const boxGeometry = new THREE.BoxGeometry(45, 45, 45); // Dimensions might need adjusting
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff, // White color
            roughness: 0.5, // Soften the material
            metalness: 0.1,
            side: THREE.BackSide // Render the inside of the box
        });
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.set(0, 22.5, 0); // Adjust position as needed
        scene.add(box);

        // Additional lighting
        const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight1);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight1.position.set(15, 25, 0);
        scene.add(directionalLight1);

        // Add the Desk model
        const loader = new GLTFLoader();
        loader.load('../Assets/DeskScene.glb', function (glb) {
            const model = glb.scene;
            model.scale.set(1, 1, 1);
            scene.add(model);
        });

        // Container for iframe
        const container = document.createElement('div');
        container.style.width = "720px";
        container.style.height = "640px";
        container.style.opacity = '1';
        container.style.background = '#1d2e2f';
        const iframe = document.createElement('iframe');
        iframe.src = "https://bing.com";
        iframe.style.width = "720px";
        iframe.style.height = "640px";
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        container.appendChild(iframe);

        // Creating CSS3DObject
        const object = new CSS3DObject(container);
        object.position.set(-0.2, 2.98, 0.12); // Set appropriate values
        object.rotation.y =-Math.PI / 2;
        object.scale.set(0.01, 0.01, 0.01); // Set appropriate values
        cssScene.add(object);

        // Creating GL plane for occlusion
        const mat = new THREE.MeshLambertMaterial();
        mat.side = THREE.DoubleSide;
        mat.opacity = 0;
        mat.transparent = true;
        mat.blending = THREE.NoBlending;

        const geometry = new THREE.PlaneGeometry(720, 640);
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.copy(object.position);
        mesh.rotation.copy(object.rotation);
        mesh.scale.copy(object.scale);
        scene.add(mesh);

        // Animation loop for CSS3D rendering
        const renderLoop = () => {
            controls.update();
            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            //composer.render(); // use composer instead of gl.render
            requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            document.body.removeChild(glcontainer);
            scene.remove(mesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    return null;
}

export default CSS3DScene;

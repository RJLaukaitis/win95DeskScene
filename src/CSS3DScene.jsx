import { useEffect, useRef } from 'react';
import { extend, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment } from '@react-three/drei';

extend({ CSS3DRenderer });

function CSS3DScene() {
    const { scene, gl, camera } = useThree();
    const cssScene = new THREE.Scene();
    const ref = useRef();
    const cssRendererRef = useRef();
    const deskGltf = useLoader(GLTFLoader, "../Assets/DeskScene.glb");

    useEffect(() => {
        // Setup the CSS3DRenderer
        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.zIndex = '0';
        document.body.appendChild(cssRenderer.domElement);

        cssRendererRef.current = cssRenderer;

        gl.domElement.style.position = "absolute";
        gl.domElement.style.top = "0";
        gl.domElement.style.zIndex = "10";

        // ORBIT CONTROLS
        const controls = new OrbitControls(camera, gl.domElement);
        const controlsCss = new OrbitControls(camera, cssRenderer.domElement);

        // LIGHTING
        scene.add(<Environment preset = "warehouse"/>);
        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(ambientLight, directionalLight);

        // Create the iframe element
        const element = document.createElement("iframe");
        element.style.width = "720px";
        element.style.height = "640px";
        element.src = "https://www.bing.com";
        element.style.border = 'none';

        const domObject = new CSS3DObject(element);
        domObject.position.set(-0.15, 2.98, 0.12);
        domObject.rotation.y = Math.PI / 2;
        domObject.scale.set(0.0012, 0.0012, 0.0011);
        cssScene.add(domObject);

        // Add the Desk model
        deskGltf.scene.position.set(0, 0, 0); // Adjust this position as needed
        scene.add(deskGltf.scene);

        // WebGL plane for occluding CSS plane
        const createOccludingPlane = () => {
            const geometry = new THREE.PlaneGeometry(720, 640);
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                opacity: 0,
                transparent: true,
                depthTest: true,
                depthWrite: true,
                blending: THREE.NoBlending
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(domObject.position);
            mesh.rotation.copy(domObject.rotation);
            mesh.scale.copy(domObject.scale);
            return mesh;
        }

        const occlusionMesh = createOccludingPlane();
        scene.add(occlusionMesh);

        // Adjust Desk Materials
        // deskGltf.scene.traverse((object) => {
        //     if (object.isMesh) {
        //         object.material = new THREE.MeshStandardMaterial({
        //             color: 0xffffff,
        //             roughness: 0.5,
        //             metalness: 0.5
        //         });
        //     }
        // });

        // Animation loop for CSS3D rendering
        const animate = () => {
            ref.current = requestAnimationFrame(animate);
            gl.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            controls.update();
            controlsCss.update();
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            cssScene.remove(domObject);
            scene.remove(occlusionMesh);
            scene.remove(deskGltf.scene);
        };
    }, [camera, scene, gl, deskGltf.scene]);

    return null;
}

export default CSS3DScene;

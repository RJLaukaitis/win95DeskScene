import { useEffect, useRef } from 'react';
import { extend, useThree, useLoader, render } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment } from '@react-three/drei';
import { FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

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

        //film grain
        const composer = new EffectComposer(gl);
        const renderPass = new RenderPass(scene, camera);
        const filmPass = new FilmPass(
            0.1,   // noise intensity
            0.025,  // scanline intensity
            648,    // scanline count
            false   // grayscale (set to true if you want grayscale)
        );

        composer.addPass(renderPass);
        composer.addPass(filmPass);

        // ORBIT CONTROLS
        const controls = new OrbitControls(camera, gl.domElement);
        const controlsCss = new OrbitControls(camera, cssRenderer.domElement);

        //LIGHTING
        scene.add(<Environment preset = "warehouse"/>);
        const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(5, 10, 5);
        scene.add(ambientLight, directionalLight);

        //white box for containing elements
        // Box geometry
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

            // Soft edges can be simulated with a slight ambient light
            const ambientLight1 = new THREE.AmbientLight(0xffffff, .2);
            scene.add(ambientLight1);

            // Additional directional light
            const directionalLight1 = new THREE.DirectionalLight(0xffffff,.3);
            directionalLight1.position.set(15, 25, 0);
            scene.add(directionalLight1);





        // Create the iframe element
        const element = document.createElement("iframe");
        element.style.width = "720px";
        element.style.height = "640px";
        element.src = "https://www.bing.com";
        element.style.border = 'none';

        const domObject = new CSS3DObject(element);
        domObject.position.set(-.05, 2.98, 0.12);
        domObject.rotation.y = Math.PI / 2;
        domObject.scale.set(0.01, 0.01, 0.011);
        cssScene.add(domObject);

        // Add the Desk model
        deskGltf.scene.position.set(0, 0, 0); // Adjust this position as needed
        scene.add(deskGltf.scene);

        
        //creating css object
        const container = document.createElement('div');
        const object = new CSS3DObject(container);
        object.position.copy(domObject.position);
        object.rotation.copy(domObject.rotation);

        //adding to CSS scene
        cssScene.add(object);

        //create GL plane
        const mat = new THREE.MeshLambertMaterial();
        mat.side = THREE.DoubleSide;
        mat.opacity = 0.5;
        mat.depthTest = true,
        mat.depthWrite = true,
        mat.color= "black";
        mat.transparent = true;
        
        //makes it occlude css 
        mat.blending = THREE.NoBlending

        const geo = new THREE.PlaneGeometry(750, 640);

        //creating gl plane mesh
        const mesh = new THREE.Mesh(geo,mat);
        mesh.position.set(.01, 2.98, 0.12);
        mesh.rotation.copy(domObject.rotation);
        mesh.scale.copy(domObject.scale);

        scene.add(mesh);

        // WebGL plane for occluding CSS plane
        // const createOccludingPlane = () => {
        //     const geometry = new THREE.PlaneGeometry(720, 640);
        //     const material = new THREE.MeshBasicMaterial({
        //         color: 0x000000,
        //         opacity: 0,
        //         transparent: true,
        //         depthTest: true,
        //         depthWrite: true,
        //         blending: THREE.NoBlending
        //     });

        //     const mesh = new THREE.Mesh(geometry, material);
        //     mesh.position.copy(domObject.position);
        //     mesh.rotation.copy(domObject.rotation);
        //     mesh.scale.copy(domObject.scale);
        //     return mesh;
        // }

        // const occlusionMesh = createOccludingPlane();
        // scene.add(occlusionMesh);

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
            composer.render();  // use composer instead of gl.render
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

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
import dust from "../Assets/Textures/MonitorOverlay/dust.jpg";
import vignette from "../Assets/Textures/MonitorOverlay/vignette2.png";
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
        //composer.addPass(filmPass);

        // ORBIT CONTROLS
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // LIGHTING
        scene.add(<Environment preset = "warehouse"/>);
        //const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

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

        //Soft edges can be simulated with a slight ambient light
        // const ambientLight1 = new THREE.AmbientLight(0xffffff, .2);
        // scene.add(ambientLight1);
        // // Additional directional light
        // const directionalLight1 = new THREE.DirectionalLight(0xffffff,.3);
        // directionalLight1.position.set(15, 25, 0);
        // scene.add(directionalLight1);

        // Add the Desk model
        const loader = new GLTFLoader();
        loader.load('../Assets/DeskScene2.glb', function (glb) {
            const model = glb.scene;
            model.scale.set(1, 1, 1);
            model.rotation.y = Math.PI/2;
            scene.add(model);
        });

        // Container for iframe
        const container = document.createElement('div');
        container.style.width = "1000px";
        container.style.height = "900px";
        container.style.opacity = '1';
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.background = '#1d2e2f';
        const iframe = document.createElement('iframe');
        //iframe.src = "https://bing.com";
        iframe.style.width = "890px";
        iframe.style.height = "820px";
        iframe.style.marginTop = "30px";
        iframe.style.marginLeft = "30px"
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        //iframe.style.margin = 'auto'; // Ensures iframe is centered within the container

        container.appendChild(iframe);

        // Creating CSS3DObject
        const object = new CSS3DObject(container);
        object.position.set(.73,3.1,0.37); // Set appropriate values .15 originally
        object.rotation.y = Math.PI;

        object.scale.set(0.00125, 0.0012, 0.003); // Set appropriate values
        cssScene.add(object);

        // Creating GL plane for occlusion
        const mat = new THREE.MeshLambertMaterial();
        mat.side = THREE.DoubleSide;
        mat.opacity = 0.1;
        mat.transparent = true;
        mat.blending = THREE.NoBlending;

        const geometry = new THREE.PlaneGeometry(1000, 900);
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(.8,3.13,0.37);
        mesh.rotation.copy(object.rotation);// Copy rotation of CSS3DObject
        mesh.scale.copy(object.scale);
        scene.add(mesh);

         // Creating vignette plate
         const texloader = new THREE.TextureLoader();
         const vignetteTexture = texloader.load(vignette, () => {
             const vmat = new THREE.MeshBasicMaterial({
                 map: vignetteTexture,
                 side: THREE.DoubleSide,
                 transparent: true,
                 opacity: 1,
                 blending: THREE.NormalBlending
             });
 
             const vgeometry = new THREE.PlaneGeometry(1000, 900);
             const vmesh = new THREE.Mesh(vgeometry, vmat);
             vmesh.position.set(.8, 3.13, 0.36); // Position it slightly in front of the iframe
             vmesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
             vmesh.scale.copy(object.scale); // Copy scale of CSS3DObject
             scene.add(vmesh);
         });

          // Creating dust plate
          const dustloader = new THREE.TextureLoader();
          const dustTexture = texloader.load(dust, () => {
              const dmat = new THREE.MeshBasicMaterial({
                  map: dustTexture,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.05,
                  blending: THREE.NormalBlending
              });
  
              const dgeometry = new THREE.PlaneGeometry(1000, 900);
              const dmesh = new THREE.Mesh(dgeometry, dmat);
              dmesh.position.set(.8, 3.13, 0.37); // Position it slightly in front of the iframe
              dmesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
              dmesh.scale.copy(object.scale); // Copy scale of CSS3DObject
              scene.add(dmesh);
          });
  
 




        // Animation loop for CSS3D rendering
        const renderLoop = () => {
            controls.update();
            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            composer.render(); // use composer instead of gl.render
            requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            document.body.removeChild(glcontainer);
            scene.remove(mesh);
            scene.remove(vmesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    return null;
}

export default CSS3DScene;

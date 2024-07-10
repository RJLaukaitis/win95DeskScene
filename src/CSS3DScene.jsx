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
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import dust from "../Assets/Textures/MonitorOverlay/dust.jpg";
import smudges from "../Assets/Textures/MonitorOverlay/smudge.png"
import vignette from "../Assets/Textures/MonitorOverlay/vignette1.png";;
import gsap from 'gsap';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


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
            0.2,   // noise intensity
            0.01, // scanline intensity
            600,   // scanline count
            false  // grayscale (set to true if you want grayscale)
        );

        composer.addPass(renderPass);
        //composer.addPass(filmPass);


        //Audio
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const officeSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('../Assets/Audio/office.mp3', function(buffer){
            officeSound.setBuffer(buffer);
            officeSound.setLoop(true);
            officeSound.setVolume(0.05);
            officeSound.play();
        });

        const startUpSound = new THREE.Audio(listener);
        audioLoader.load('../Assets/Audio/startup.mp3',function(buffer){
            startUpSound.setBuffer(buffer);
            startUpSound.setVolume(0.1);
            startUpSound.play();
        });

        // ENVIRONMENT
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;



        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        //scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, .8); 
        directionalLight.position.set(0, 10, 10);


        //FOG
        const fogColor = 0xf9f9f9;
        const fogdensity = 0.035;
        scene.fog = new THREE.FogExp2(fogColor,fogdensity);


        // Container for iframe
        const container = document.createElement('div');
        container.style.width = "1400px";
        container.style.height = "1000px";
        container.style.opacity = '1';
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.background = '#1d2e2f';
        container.style.pointerEvents = 'auto'; // Ensure the container allows pointer events
        container.style.zIndex = '10';
        //container.style.filter = 'brightness(1.5)'; // Increase brightness

        const iframe = document.createElement('iframe');
        iframe.src = "https://laukaitisos.netlify.app/";
        iframe.style.width = "1190px";
        iframe.style.height = "840px";
        iframe.style.marginTop = "80px";
        iframe.style.marginLeft = "135px";
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        //iframe.style.zIndex = '10';
        //iframe.style.filter = "brightness(2)";
        iframe.style.overflow = "hidden"; // Hide scroll bars

        container.appendChild(iframe);

        // Creating CSS3DObject
        const object = new CSS3DObject(container);
        object.position.set(.73,3.1,.38); //3.1 for y
        object.rotation.y = Math.PI;

        object.scale.set(0.00125, 0.0012, 0.003); // Set appropriate values
        cssScene.add(object);

        // Creating GL plane for occlusion
        const mat = new THREE.MeshLambertMaterial();
        mat.side = THREE.DoubleSide;
        mat.opacity = 0.1;
        mat.transparent = true;
        mat.blending = THREE.NoBlending;

        const geometry = new THREE.PlaneGeometry(1400, 1000);
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(.80,3.1,.38);
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
 
             const vgeometry = new THREE.PlaneGeometry(1400, 1000);
             const vmesh = new THREE.Mesh(vgeometry, vmat);
             vmesh.position.set(.8, 3.13, 0.36); // Position it slightly in front of the iframe
             vmesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
             vmesh.scale.copy(object.scale); // Copy scale of CSS3DObject
             scene.add(vmesh);
         });

          // Creating dust plate
          const dustTexture = texloader.load(dust, () => {
              const dmat = new THREE.MeshBasicMaterial({
                  map: dustTexture,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.01,
                  blending: THREE.NormalBlending
              });
  
              const dgeometry = new THREE.PlaneGeometry(1400, 1000);
              const dmesh = new THREE.Mesh(dgeometry, dmat);
              dmesh.position.set(.8, 3.13, 0.37); // Position it slightly in front of the iframe
              dmesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
              dmesh.scale.copy(object.scale); // Copy scale of CSS3DObject
              scene.add(dmesh);
          });

          //creating curved glass screen
          const planeGeometry = new THREE.PlaneGeometry(1300, 1000, 55, 55); // Increased segments for smooth curve
            const curveAmount = 20; // Adjust the amount of curvature
            for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(planeGeometry.attributes.position, i);
                
                // Apply a quadratic formula for convex curvature
                const distX = (vertex.x / 500) ** 2; // Normalize and square the X position
                const distY = (vertex.y / 450) ** 2; // Normalize and square the Y position
                const dist = Math.sqrt(distX + distY); // Combine distances
                
                vertex.z = curveAmount * dist; // Apply curvature

                // Update the vertex position
                planeGeometry.attributes.position.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            const smudgeTexture = texloader.load(smudges, () => {
                const smat = new THREE.MeshBasicMaterial({
                    map: smudgeTexture,
                    side: THREE.DoubleSide,
                    opacity: .12,
                    transparent:true,
                    blending: THREE.NormalBlending
                });

            const convexPlane = new THREE.Mesh(planeGeometry,smat);
            convexPlane.position.set(0.7, 3.13, 0.2);
            convexPlane.scale.copy(object.scale);
            scene.add(convexPlane);
        });

        //Video textures for screen effects
        const video = document.createElement('video');
        video.src = "../Assets/Textures/MonitorOverlay/VHS2.mp4"
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.pointerEvents = 'none'; 
        video.play();
        document.body.appendChild(video);

        const crtTexture = new THREE.VideoTexture(video);

        const videoMaterial = new THREE.MeshBasicMaterial({
            map: crtTexture,
            side: THREE.DoubleSide,
            transparent:true,
            opacity:.5,
            blending: THREE.AdditiveBlending
        });
        const crtgeometry = new THREE.PlaneGeometry(1400, 1000);
        const crtmesh = new THREE.Mesh(crtgeometry, videoMaterial);
        crtmesh.position.set(0.8, 3.13, .35);
        crtmesh.scale.copy(object.scale);
        crtmesh.rotation.y = Math.PI;
        scene.add(crtmesh);

        //second video to add more depth
        const vhsvideo = document.createElement('video');
        vhsvideo.src = "../Assets/Textures/MonitorOverlay/VHS1.mp4"
        vhsvideo.autoplay = true;
        vhsvideo.loop = true;
        vhsvideo.muted = true;
        vhsvideo.style.pointerEvents = 'none'; 
        video.play();
        document.body.appendChild(vhsvideo);

        const vhsTexture = new THREE.VideoTexture(vhsvideo);

        const vhsmaterial = new THREE.MeshBasicMaterial({
            map: vhsTexture,
            side: THREE.DoubleSide,
            transparent:true,
            opacity:0.1,
            blending: THREE.AdditiveBlending
        });
        const vhsgeometry = new THREE.PlaneGeometry(1400, 1000);
        const vhsmesh = new THREE.Mesh(vhsgeometry, vhsmaterial);
        vhsmesh.position.set(0.8, 3.13, .33);
        vhsmesh.scale.copy(object.scale); 
        scene.add(vhsmesh);

        //dimming plane
            const dimmaterial = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x000000,
                transparent:true,
                blending: THREE.NormalBlending,
            });

            // Dimming plane geometry
            const dimplane = new THREE.PlaneGeometry(1400, 1000);
            const dimMesh = new THREE.Mesh(dimplane, dimmaterial);
            dimMesh.position.set(0.8, 3.13, .32);
            dimMesh.rotation.copy(object.rotation);
            dimMesh.scale.copy(object.scale);
            scene.add(dimMesh);



// Initial flyover animation
const startPosition = { x: 20, y: 9, z: -20 };
const endPosition = { x: -14, y: 9, z: -9 };

camera.position.set(startPosition.x, startPosition.y, startPosition.z);
camera.lookAt(0, 3, 0);

let orbitAnimation = gsap.to(camera.position, {
    x: endPosition.x,
    y: endPosition.y,
    z: endPosition.z,
    duration: 70,
    repeat: -1, // Infinite repetition
    yoyo: true,
    ease: 'none',
    onUpdate: () => {
        camera.lookAt(0, 3.1, 0);
    }
});
const zoomInPosition = {x:14,y:9,z:-15}; //initial zoom into the scene on page load


// Function to adjust camera position and lookAt
const adjustCamera = (endPos, endLookAt, duration = 1) => {
        const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        const startLookAt = { x: 3, y: 2, z: 0 }; // Initial lookAt target
        const lookAtProxy = { x: startLookAt.x, y: startLookAt.y, z: startLookAt.z };

        gsap.to(camera.position, {
            x: endPos.x,
            y: endPos.y,
            z: endPos.z,
            ease: 'power3.inOut',
            duration: duration,
            onUpdate: () => {
                camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
            },
            onComplete: () => {
                camera.lookAt(endLookAt.x, endLookAt.y, endLookAt.z);
            }
        });

        gsap.to(lookAtProxy, {
            x: endLookAt.x,
            y: endLookAt.y,
            z: endLookAt.z,
            ease: 'power3.inOut',
            duration: duration,
            onUpdate: () => {
                camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
            }
        });

        camera.updateProjectionMatrix();
    };

    adjustCamera(zoomInPosition,{x:0, y:3.1, z:30},2);


    // Event listener for click to zoom in
    window.addEventListener('mousedown', () => {
        orbitAnimation.kill(); // Stop the idle animation
        adjustCamera({ x: 0.8, y: 3, z: -5 }, { x: 0, y: 3.1, z: 30 });
    });

    // Event listener for hover to zoom in
    const computerScreen = document.querySelector('div'); // Replace with your screen selector
    computerScreen.addEventListener('mouseover', () => {
        orbitAnimation.kill(); // Stop the idle animation
        adjustCamera({ x: 0.8, y: 3.1, z: -1.2 }, { x: 0, y: 3.1, z: 30 });
    });

    // Event listener to zoom out when mouse leaves the screen
    computerScreen.addEventListener('mouseout', () => {
        adjustCamera({ x: 14, y: 9, z: -12 }, { x: 0, y: 3, z: 0 }, 2); // Back to initial position and target
    });

// Animation loop for CSS3D rendering
const renderLoop = () => {
    // Dimming effect logic
    if (dimMesh) {
        const planeNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(dimMesh.quaternion); // Adjust plane normal by plane rotation
        const viewVector = new THREE.Vector3();
        viewVector.copy(camera.position);
        viewVector.sub(dimMesh.position);
        viewVector.normalize();

        const dot = viewVector.dot(planeNormal);

        // Calculate the distance from the camera vector to the plane vector
        const dimPos = dimMesh.position;
        const camPos = camera.position;

        const distance = camPos.distanceTo(dimPos);

        const opacity = Math.min(1 / (distance / 10000), 1); // Ensure opacity does not exceed 1

        const DIM_FACTOR = 2;

        // Update the material opacity
        const newOpacity = (1 - opacity) * DIM_FACTOR + (1 - dot) * DIM_FACTOR;
        dimMesh.material.opacity = newOpacity
    }



            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            composer.render();
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
            scene.remove(gmesh);
            scene.remove(smesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    return null;
}

export default CSS3DScene;
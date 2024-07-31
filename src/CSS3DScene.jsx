import { useEffect, useRef, useState} from 'react';
import { extend, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import Ui from './UserInterface/Ui';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import dust from "../Assets/Textures/MonitorOverlay/dust.jpg";
import smudges from "../Assets/Textures/MonitorOverlay/smudge.png";
import {TAARenderPass} from 'three/examples/jsm/postprocessing/TAARenderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import FilmGrainShader from './Grain/FilmGrainShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vignette from "../Assets/Textures/MonitorOverlay/vignette1.png";
import gsap from 'gsap';

import './CSS3DScene.css';


extend({ CSS3DRenderer });

const CSS3DScene = () => {
    const zoomStateRef = useRef(false);
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

        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1; // Adjust exposure if necessary
        glcontainer.appendChild(renderer.domElement);
        document.body.appendChild(glcontainer);

        // Setup the CSS3DRenderer
        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = 0;
        cssRenderer.domElement.id = 'css3d';
        document.body.appendChild(cssRenderer.domElement);

        //Audio
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const officeSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('../Assets/Audio/office.mp3', function(buffer){
            officeSound.setBuffer(buffer);
            officeSound.setLoop(true);
            officeSound.setVolume(0.1);
            officeSound.play();
        });

        const startUpSound = new THREE.Audio(listener);
        audioLoader.load('../Assets/Audio/startup.mp3',function(buffer){
            startUpSound.setBuffer(buffer);
            startUpSound.setVolume(0.1);
            startUpSound.play();
        });

        //
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        const grainPass = new ShaderPass(FilmGrainShader);
        composer.addPass(grainPass);

        const ssaaPass = new SSAARenderPass(scene,camera);
        composer.addPass(ssaaPass);

        const taaPass = new TAARenderPass(scene,camera);
        //composer.addPass(taaPass);

        
        const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
        //composer.addPass(smaaPass);




        //lowpass filter for when camera is on computer screen
        const context = listener.context;
        const lowPassFilter = context.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.setValueAtTime(2100, context.currentTime);

        // ENVIRONMENT
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        const envMap = pmremGenerator.fromScene( new RoomEnvironment(), 1.0 ).texture;
        scene.environment = envMap;

        //renderer settings
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.physicallyCorrectLights = true;


        //FOG
        const fogColor = 0xf9f9f9;
        const fogdensity = 0.02;
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
        container.style.pointerEvents = 'all'; // Ensure the container allows pointer events

        const iframe = document.createElement('iframe');
        iframe.src = "https://laukaitisos.netlify.app/";
        iframe.style.width = "1240px";
        iframe.style.height = "865px";
        iframe.style.marginTop = "67px";
        iframe.style.marginLeft = "100px";
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        iframe.style.zIndex = '15';
        iframe.style.brightness = "3";
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
        mat.opacity = 0.01;
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
            opacity:.2,
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
            opacity:0.2,
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
    

            const adjustCamera = (endPos, endLookAt, duration = 1, onComplete = () => {}) => {
                const lookAtProxy = new THREE.Vector3();
            
                gsap.to(camera.position, {
                    x: endPos.x,
                    y: endPos.y,
                    z: endPos.z,
                    ease: 'power3.inOut',
                    duration: duration,
                    onUpdate: () => {
                        camera.lookAt(lookAtProxy);
                    },
                    onComplete: () => {
                        camera.lookAt(endLookAt);
                        onComplete();
                    }
                });
            
                gsap.to(lookAtProxy, {
                    x: endLookAt.x,
                    y: endLookAt.y,
                    z: endLookAt.z,
                    ease: 'power3.inOut',
                    duration: duration,
                    onUpdate: () => {
                        camera.lookAt(lookAtProxy);
                    }
                });
            };
            
            const adjustCameraOverScreen = (endPos, endLookAt, duration = 1, onComplete = () => {}) => {
                const lookAtProxy = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
            
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
                        onComplete();
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
            
            // Initial flyover animation
            const zoomInPosition = { x: 15, y: 9, z: -20 };
            const startPosition = { x: 20, y: 9, z: -20 };
            const endPosition = { x: -14, y: 9, z: -9 };
            
            // Set the initial camera position
            camera.position.set(startPosition.x, startPosition.y, startPosition.z);
            camera.lookAt(0, 3.1, 0);
            
            // Create a GSAP timeline to sequence animations
            const tl = gsap.timeline();
            
            // Add the zoom-in animation to the timeline
            tl.to(camera.position, {
                x: zoomInPosition.x,
                y: zoomInPosition.y,
                z: zoomInPosition.z,
                ease: 'power3.inOut',
                duration: 2,
                onUpdate: () => {
                    camera.lookAt(0, 3.1, 0);
                },
                onComplete: () => {
                    camera.lookAt(0, 3.1, 0);
                    startOrbit();
                }
            });
            
            camera.updateProjectionMatrix();
            
            let orbitAnimation;
            const startOrbit = () => {
                orbitAnimation = gsap.to(camera.position, {
                    x: endPosition.x,
                    y: endPosition.y,
                    z: endPosition.z,
                    duration: 30,
                    repeat: -1,
                    yoyo: true,
                    ease: 'none',
                    onUpdate: () => {
                        camera.lookAt(0, 3.1, 0);
                    }
                });
            };
            
            // Control flag for raycaster activity
            let isRaycasterActive = false;
            
            // Event listener for mouse click to zoom in or return to orbit
            window.addEventListener('mousedown', () => {
                if (event.target.closest('.sound-box, .name-box, .position-box, .time-box')) return; // Ignore clicks on specific UI elements
                
                if (zoomStateRef.current) return;
            
                if (isZoomedIn) {
                    // Return to orbit if zoomed into the desk
                    adjustCamera(startPosition, { x: 0, y: 3.1, z: 0 }, 1, () => {
                        startOrbit();
                        isRaycasterActive = false;
                    });
                    isZoomedIn = false;
                    isMouseDown = false;
                    window.removeEventListener('mousemove', followMouse);
                } else {
                    // Zoom into the desk
                    orbitAnimation.kill(); // Stop the idle animation
                    adjustCamera({ x: 0.8, y: 3, z: -5 }, { x: 0, y: 3.1, z: 30 }, 1, () => {
                        isRaycasterActive = true;
                    });
                    isZoomedIn = true;
                    isMouseDown = true;
                    window.addEventListener('mousemove', followMouse);
                }
            });
            
            camera.updateProjectionMatrix();
            
            let screenObject = dimMesh;
            
            // Initialize raycaster and mouse vector
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            let isMouseDown = false;
            let isHoveringScreen = false;
            let isZoomedIn = false;
            let isZoomedIntoScreen = false;
            
            // Function to handle zooming into the screen
            const zoomIntoScreen = () => {
                const zoomPosition = { x: 0.7, y: 3.1, z: -1.3 };
                adjustCameraOverScreen(zoomPosition, { x: 0.7, y: 3.1, z: 0 });
                isZoomedIntoScreen = true;
                zoomStateRef.current = true;
                officeSound.setFilter(lowPassFilter);
            };
            
            // Function to follow the mouse
            const followMouse = (event) => {
                if (!isZoomedIn || isZoomedIntoScreen) return;
            
                const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
                // Adjust the camera position based on mouse movement
                const targetX = 0.8 - mouseX * 0.2;
                const targetY = 3 + mouseY * 0.2;  
            
                camera.position.x = targetX;
                camera.position.y = targetY;
                camera.lookAt(0, 3.1, 30);
            };
            
            // Debounce function to limit how often a function can be executed
            const debounce = (func, wait) => {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            };
            
            // Function to handle mouse move and check for intersections
            const handleMouseMove = debounce((event) => {
                if (!isRaycasterActive) return;
            
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
                // Update the raycaster with the camera and mouse position
                raycaster.setFromCamera(mouse, camera);
            
                // Calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObject(screenObject);
            
                if (intersects.length > 0) {
                    if (!isHoveringScreen) {
                        isHoveringScreen = true;
                        zoomIntoScreen();
                    }
                } else {
                    if (isHoveringScreen && isZoomedIntoScreen) {
                        isHoveringScreen = false;
                        adjustCameraOverScreen({ x: 0.8, y: 3, z: -5 }, { x: 0, y: 3.1, z: 30 }, 1, () => {
                            isZoomedIntoScreen = false;
                            zoomStateRef.current = false; // Update ref
                            setTimeout(() => {
                                if (isZoomedIn && !isZoomedIntoScreen) {
                                    window.addEventListener('mousemove', followMouse);
                                }
                            }, 1000);
                        });
                    }
                }
            }, 50); 
            
            // Event listener for mouse movement to check for intersections
            window.addEventListener('mousemove', handleMouseMove);
            
            // Ensure this is called after setting up animations and event listener
            camera.updateProjectionMatrix();

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

        const DIM_FACTOR = 2.5;

        // Update the material opacity
        const newOpacity = (1 - opacity) * DIM_FACTOR + (1 - dot) * DIM_FACTOR;
        dimMesh.material.opacity = newOpacity
    }


            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
            if (grainPass.uniforms.u_time) {
                grainPass.uniforms.u_time.value = performance.now() * 0.001;
              } else {
                console.error('u_time uniform is undefined');
              }
            
              composer.render();
            


            requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Cleanup
        return () => {
            cancelAnimationFrame(ref.current);
            document.body.removeChild(cssRenderer.domElement);
            document.body.removeChild(glcontainer);
            scene.remove(listener);
            scene.remove(object);
            scene.remove(mesh);
            // scene.remove(dmesh);
            // scene.remove(vmesh);
            // scene.remove(gmesh);
            // scene.remove(crtmesh);
            scene.remove(vhsmesh);
            // scene.remove(convexPlane);
            scene.remove(dimMesh);
            // scene.remove(smesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    //useeffect for ui
    useEffect(() => {
        ReactDOM.render(<Ui zoomStateRef={zoomStateRef} />, document.getElementById('ui-container'));
      }, [zoomStateRef]);
    return null;
}

export default CSS3DScene;
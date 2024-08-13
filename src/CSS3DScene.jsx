import { useEffect, useRef } from 'react';
import { extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import Ui from './UserInterface/Ui';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import dust from "../Assets/Textures/MonitorOverlay/dust.jpg";
import smudges from "../Assets/Textures/MonitorOverlay/smudge.png";
import vignette from "../Assets/Textures/MonitorOverlay/vignette1.png";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import gsap from 'gsap';

import './CSS3DScene.css';

extend({ CSS3DRenderer });

const CSS3DScene = ({ onLoadingComplete }) => {
    const zoomStateRef = useRef(false);
    const { scene, camera } = useThree();
    const cssScene = new THREE.Scene();
    const ref = useRef();

    // References to loaded resources
    const modelRef = useRef();
    const vignetteTextureRef = useRef();
    const dustTextureRef = useRef();
    const smudgeTextureRef = useRef();
    const crtTextureRef = useRef();

    let renderer, cssRenderer;

    useEffect(() => {

        //loading glb
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(draco);

        loader.load('../Assets/compressed3.glb', function (glb) {
            const model = glb.scene;
            scene.add(model);
            model.scale.set(1, 1, 1);
            model.side = THREE.DoubleSide;
            model.rotation.y = Math.PI / 2;
            modelRef.current = model; // Save reference to model

            onLoadingComplete(); // Notify that the model is loaded
        });

        // Setup the CSS3DRenderer
        
        const glcontainer = document.createElement('div');
        glcontainer.id = 'webgl';
         renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = 0;
        cssRenderer.domElement.id = 'css3d';
        document.body.appendChild(cssRenderer.domElement);

        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1; // Adjust exposure if necessary
        glcontainer.appendChild(renderer.domElement);
        document.body.appendChild(glcontainer);

                // ENVIRONMENT
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromScene(new RoomEnvironment(), 1.0).texture;
    scene.environment = envMap;

        // Audio
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const officeSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('../Assets/Audio/office2.mp3', (buffer) => {
            officeSound.setBuffer(buffer);
            officeSound.setLoop(true);
            officeSound.setVolume(0.1);
            officeSound.play();
        });

        const startUpSound = new THREE.Audio(listener);
        audioLoader.load('../Assets/Audio/startup2.mp3', (buffer) => {
            startUpSound.setBuffer(buffer);
            startUpSound.setVolume(0.1);
            startUpSound.play();
        });

        // Lowpass filter for when the camera is on the computer screen
        const context = listener.context;
        const lowPassFilter = context.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.setValueAtTime(2100, context.currentTime);

        // FOG
        const fogColor = 0xf9f9f9;
        const fogdensity = 0.02;
        scene.fog = new THREE.FogExp2(fogColor, fogdensity);

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
        iframe.style.border = '0';
        iframe.style.padding = '0';
        iframe.style.boxShadow = 'none';
        iframe.style.opacity = '1';
        iframe.style.zIndex = '15';
        iframe.style.brightness = "5";
        iframe.style.overflow = "hidden"; // Hide scroll bars

        container.appendChild(iframe);

        // Creating CSS3DObject
        const object = new CSS3DObject(container);
        object.position.set(.73, 3.1, .38); //3.1 for y
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
        mesh.position.set(.80, 3.1, .38);
        mesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
        mesh.scale.copy(object.scale);
        scene.add(mesh);

        // Creating vignette plate
        const texloader = new THREE.TextureLoader();
        vignetteTextureRef.current = texloader.load(vignette, () => {
            const vmat = new THREE.MeshBasicMaterial({
                map: vignetteTextureRef.current,
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
        dustTextureRef.current = texloader.load(dust, () => {
            const dmat = new THREE.MeshBasicMaterial({
                map: dustTextureRef.current,
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

        // Creating curved glass screen
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
        smudgeTextureRef.current = texloader.load(smudges, () => {
            const smat = new THREE.MeshBasicMaterial({
                map: smudgeTextureRef.current,
                side: THREE.DoubleSide,
                opacity: .06,
                transparent: true,
                blending: THREE.NormalBlending
            });
            const convexPlane = new THREE.Mesh(planeGeometry, smat);
            convexPlane.position.set(0.7, 3.13, 0.2);
            convexPlane.scale.copy(object.scale);
            scene.add(convexPlane);

        });

        // Video textures for screen effects
        const video = document.createElement('video');
        video.src = "../Assets/Textures/MonitorOverlay/VHS3.mp4"
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.pointerEvents = 'none';
        video.play();
        document.body.appendChild(video);

        crtTextureRef.current = new THREE.VideoTexture(video);

        const videoMaterial = new THREE.MeshBasicMaterial({
            map: crtTextureRef.current,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .4,
            blending: THREE.AdditiveBlending
        });
        const crtgeometry = new THREE.PlaneGeometry(1400, 1000);
        const crtmesh = new THREE.Mesh(crtgeometry, videoMaterial);
        crtmesh.position.set(0.8, 3.13, .35);
        crtmesh.scale.copy(object.scale);
        crtmesh.rotation.y = Math.PI;
        scene.add(crtmesh);

        // Dimming plane
        const dimmaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x000000,
            transparent: true,
            blending: THREE.NormalBlending,
        });

        // Dimming plane geometry
        const dimplane = new THREE.PlaneGeometry(1400, 1000);
        const dimMesh = new THREE.Mesh(dimplane, dimmaterial);
        dimMesh.position.set(0.8, 3.13, .32);
        dimMesh.rotation.copy(object.rotation);
        dimMesh.scale.copy(object.scale);
        scene.add(dimMesh);

        const adjustCamera = (endPos, endLookAt, duration = 1, onComplete = () => { }) => {
            const lookAtProxy = new THREE.Vector3(0,3.1,0);
        
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
        
        const adjustCameraOverScreen = (endPos, endLookAt, duration = 1, onComplete = () => { }) => {
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
        };
        
        const zoomInPosition = { x: 15, y: 9, z: -20 };
        const startPosition = { x: 20, y: 9, z: -20 };
        const endPosition = { x: -14, y: 9, z: -9 };
        
        camera.position.set(startPosition.x, startPosition.y, startPosition.z);
        camera.lookAt(0, 3.1, 0);
        
        const tl = gsap.timeline();
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
        
        let isRaycasterActive = false;
        let isMouseDown = false;
        let isHoveringScreen = false;
        let isZoomedIn = false;
        let isZoomedIntoScreen = false;
        let isTransitioning = false;
        
        window.addEventListener('mousedown', (event) => {
            if (event.target.closest('.sound-box, .name-box, .position-box, .time-box')) return;
        
            if (zoomStateRef.current || isTransitioning) return;
        
            if (isZoomedIn) {
                isTransitioning = true;
                adjustCamera(startPosition, { x: 0, y: 3.1, z: 0}, 1, () => {
                    startOrbit();
                    isRaycasterActive = false;
                    isTransitioning = false;
                    window.addEventListener('mousemove', followMouse);
                });
                isZoomedIn = false;
                isMouseDown = false;
                window.removeEventListener('mousemove', followMouse);
            } else {
                orbitAnimation.kill();
                isTransitioning = true;
                adjustCamera({ x: 0.8, y: 3, z: -5 }, { x: 0, y: 3.1, z: 30 }, 1, () => {
                    isRaycasterActive = true;
                    isTransitioning = false;
                });
                isZoomedIn = true;
                isMouseDown = true;
                window.addEventListener('mousemove', followMouse);
            }
        });
        
        const screenObject = dimMesh;
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const zoomIntoScreen = () => {
            if (isTransitioning) return;
        
            isTransitioning = true;
            const zoomPosition = { x: 0.7, y: 3.1, z: -1.3 };
            adjustCameraOverScreen(zoomPosition, { x: 0.7, y: 3.1, z: 0 }, 1, () => {
                isZoomedIntoScreen = true;
                zoomStateRef.current = true;
                officeSound.setFilter(lowPassFilter);
                officeSound.setVolume(0.05);
                window.removeEventListener('mousemove', followMouse);
                isTransitioning = false;
            });
        };
        
        const followMouse = (event) => {
            if (!isZoomedIn || isZoomedIntoScreen || isTransitioning) return;
        
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
            const targetX = 0.8 - mouseX * 0.4;
            const targetY = 3 + mouseY * 0.4;
        
            camera.position.x = targetX;
            camera.position.y = targetY;
            camera.lookAt(0, 3.1, 30);
        };
        
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };
        
        const handleMouseMove = debounce((event) => {
            if (!isRaycasterActive || isTransitioning) return;
        
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            raycaster.setFromCamera(mouse, camera);
        
            const intersects = raycaster.intersectObject(screenObject);
        
            if (intersects.length > 0) {
                if (!isHoveringScreen) {
                    isHoveringScreen = true;
                    zoomIntoScreen();
                }
            } else {
                if (isHoveringScreen && isZoomedIntoScreen) {
                    isHoveringScreen = false;
                    isTransitioning = true;
                    adjustCameraOverScreen({ x: 0.8, y: 3, z: -5 }, { x: 0, y: 3.1, z: 30 }, 1, () => {
                        officeSound.setFilter(null);
                        isZoomedIntoScreen = false;
                        zoomStateRef.current = false;
                        isTransitioning = false;
                        window.addEventListener('mousemove', followMouse);
                    });
                }
            }
        }, 50);
        
        window.addEventListener('mousemove', handleMouseMove);
        
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

                const DIM_FACTOR = 3.0;

                // Update the material opacity
                const newOpacity = (1 - opacity) * DIM_FACTOR + (1 - dot) * DIM_FACTOR;
                dimMesh.material.opacity = newOpacity;
            }

            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);

            requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Cleanup
        return () => {
            // Stop any ongoing animations
            if (orbitAnimation) orbitAnimation.kill();
            if (tl) tl.kill();

            // Remove event listeners
            window.removeEventListener('mousedown', handleMouseMove);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', followMouse);

            // Dispose of three.js objects
            renderer.dispose();
            cssRenderer.dispose();

            // Dispose of loaded resources
            if (modelRef.current) {
                scene.remove(modelRef.current);
                modelRef.current.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        if (child.material.isMaterial) {
                            child.material.dispose();
                        } else {
                            child.material.forEach((material) => material.dispose());
                        }
                    }
                });
            }

            const texturesToDispose = [
                vignetteTextureRef.current,
                dustTextureRef.current,
                smudgeTextureRef.current,
                crtTextureRef.current,
            ];

            texturesToDispose.forEach((texture) => {
                if (texture) {
                    texture.dispose();
                }
            });

            // Remove added DOM elements
            if (document.getElementById('webgl')) {
                document.body.removeChild(document.getElementById('webgl'));
            }
            if (document.getElementById('css3d')) {
                document.body.removeChild(document.getElementById('css3d'));
            }
            if (video) {
                document.body.removeChild(video);
            }

            // Remove objects from the scene
            scene.remove(listener);
            scene.remove(dimMesh);
            scene.remove(envMap);
            scene.remove(crtmesh);
            scene.remove(object);
            scene.remove(mesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    // UseEffect for UI
    useEffect(() => {
        ReactDOM.render(<Ui zoomStateRef={zoomStateRef} />, document.getElementById('ui-container'));
    }, [zoomStateRef]);

    return null;
};

export default CSS3DScene;

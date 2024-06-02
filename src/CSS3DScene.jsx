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
import smudges from "../Assets/Textures/MonitorOverlay/smudge.jpg"
import vignette from "../Assets/Textures/MonitorOverlay/vignette2.png";;
import gsap from 'gsap';
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

        //initializing shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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



        // ENVIRONMENT
        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
		scene.environment = pmremGenerator.fromScene( environment ).texture;

        //spotlight
        const light = new THREE.DirectionalLight(0xffffff,0.5,100);
        light.position.set(2,10,2);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048; // default
        light.shadow.mapSize.height = 2048; // default
        light.shadow.camera.near = 0.1; // default
        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;
        light.shadow.camera.left = -10;
        light.shadow.camera.right = 10;
        light.shadow.camera.far = 500; // default
        light.shadow.bias = -0.001;
        scene.add(light);

        //FOG
        const fogColor = 0xf9f9f9;
        const fogdensity = 0.037;
        scene.fog = new THREE.FogExp2(fogColor,fogdensity);


        // Add the Desk scene
        const loader = new GLTFLoader();
        loader.load('../Assets/DeskSceneREVISED.glb', function (glb) {
            const model = glb.scene;
            model.scale.set(1, 1, 1);
            model.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            model.side = THREE.DoubleSide;
            model.rotation.y = Math.PI/2;
            scene.add(model);
        });

        //setting up camera animation
        camera.lookAt(3,2,0);
        const adjustCamera = () => {
            // Define the start and end positions for the camera
            const startPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
            const endPosition = { x: 0.8, y: 3.1, z: -1.2 };
        
            // Define the start and end positions for the lookAt target
            const startLookAt = { x: 3, y: 2, z: 0 };
            const endLookAt = { x: 0, y: 3.1, z: 30 };
        
            // Create a proxy object for the lookAt target
            const lookAtProxy = { x: startLookAt.x, y: startLookAt.y, z: startLookAt.z };
        
            // Animate the camera position
            gsap.to(camera.position, {
                x: endPosition.x,
                y: endPosition.y,
                z: endPosition.z,
                ease: 'power3.inOut',
                duration: 1,
                onUpdate: function () {
                    // Update the camera's lookAt target during the animation
                    camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
                },
                onComplete: function () {
                    // Ensure the final lookAt position is accurate
                    camera.lookAt(endLookAt.x, endLookAt.y, endLookAt.z);
                }
            });
        
            // Animate the lookAt proxy object
            gsap.to(lookAtProxy, {
                x: endLookAt.x,
                y: endLookAt.y,
                z: endLookAt.z,
                ease: 'power3.inOut',
                duration: 1,
                onUpdate: function () {
                    // Update the camera's lookAt target during the animation
                    camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
                }
            });
        
            camera.updateProjectionMatrix();
        }

    window.addEventListener('mousedown', adjustCamera);

        // Container for iframe
        const container = document.createElement('div');
        container.style.width = "1000px";
        container.style.height = "900px";
        container.style.opacity = '1';
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.background = '#1d2e2f';
        container.style.pointerEvents = 'auto'; // Ensure the container allows pointer events
        //container.style.zIndex = '10';
        //container.style.filter = 'brightness(1.5)'; // Increase brightness

        const iframe = document.createElement('iframe');
        iframe.src = "http://localhost:3000/home";
        iframe.style.width = "890px";
        iframe.style.height = "820px";
        iframe.style.marginTop = "30px";
        iframe.style.marginLeft = "30px"
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        //iframe.style.zIndex = '10';
        iframe.style.filter = "brightness(1.2)";
        iframe.style.overflow = "hidden"; // Hide scroll bars

        container.appendChild(iframe);

        // Creating CSS3DObject
        const object = new CSS3DObject(container);
        object.position.set(.73,3.1,.38); // Set appropriate values .15 originally
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
        mesh.position.set(.8,3.13,.38);
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
                 opacity: 0.4,
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
          const dustTexture = texloader.load(dust, () => {
              const dmat = new THREE.MeshBasicMaterial({
                  map: dustTexture,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.08,
                  blending: THREE.NormalBlending
              });
  
              const dgeometry = new THREE.PlaneGeometry(1000, 900);
              const dmesh = new THREE.Mesh(dgeometry, dmat);
              dmesh.position.set(.8, 3.13, 0.37); // Position it slightly in front of the iframe
              dmesh.rotation.copy(object.rotation); // Copy rotation of CSS3DObject
              dmesh.scale.copy(object.scale); // Copy scale of CSS3DObject
              scene.add(dmesh);
          });

          //creating curved glass screen
          const planeGeometry = new THREE.PlaneGeometry(1000, 900, 55, 55); // Increased segments for smooth curve
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
                    opacity: .01,
                    transparent:true,
                    blending: THREE.NormalBlending
                });

            const convexPlane = new THREE.Mesh(planeGeometry,smat);
            convexPlane.position.set(0.8, 3.13, 0.2);
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
            opacity:.4,
            blending: THREE.AdditiveBlending
        });
        const crtgeometry = new THREE.PlaneGeometry(1000, 900);
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
            opacity:0.15,
            blending: THREE.AdditiveBlending
        });
        const vhsgeometry = new THREE.PlaneGeometry(1000, 900);
        const vhsmesh = new THREE.Mesh(vhsgeometry, vhsmaterial);
        vhsmesh.position.set(0.8, 3.13, .33);
        vhsmesh.scale.copy(object.scale); 
        scene.add(vhsmesh);

        // Animation loop for CSS3D rendering
        const renderLoop = () => {
            //controls.update();
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
            scene.remove(gmesh);
            scene.remove(smesh);
            cssScene.remove(object);
        };
    }, [camera, scene]);

    return null;
}

export default CSS3DScene;

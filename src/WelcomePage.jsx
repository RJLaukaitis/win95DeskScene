import React, { useEffect, useRef, useState } from 'react';
import "./WelcomePage.css";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';

const WelcomePage = ({ onEnter, setModel, setModelLoaded, onLoadingComplete }) => {
  const infoRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const mainSystemInfo = [
      "System information",
      "Uptime: 183960 hours",
      "CPU Usage: 23%",
      "Memory Usage: 23%",
      "Network: Connected to internet",
      "Temperature: 42°C",
      "GPU Usage: 15%",
      "System Load: 1.2",
      "Kernel Version: 5.4.0-42-generic",
    ];

    const additionalMessages = [
      "Loading models...",
      "Preparing office...",
      "Turning on computer...",
      "Initializing network...",
      "Bootstrapping system...",
      "Starting services..."
    ];

    const displayInfo = (messages, delay, callback) => {
      messages.forEach((info, index) => {
        setTimeout(() => {
          infoRef.current.innerText += `${info}\n`;
          if (index === messages.length - 1 && callback) {
            callback();
          }
        }, index * delay);
      });
    };

    const displayMessages = async () => {
      await new Promise(resolve => {
        displayInfo(mainSystemInfo, 200, resolve);
      });
      displayInfo(additionalMessages, 800, () => {
        setShowModal(true);
        setLoadingComplete(true); // Notify that loading is complete
      });
    };

    displayMessages();

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(draco);

    loader.load('../Assets/compressed3.glb', function (glb) {
      const model = glb.scene;
      model.scale.set(1, 1, 1);
      model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      model.side = THREE.DoubleSide;
      model.rotation.y = Math.PI / 2;
      setModel(model);
      setModelLoaded(true);
      onLoadingComplete(); // Notify that loading is complete
    }, undefined, function (error) {
      console.error('An error happened while loading the model', error);
      onLoadingComplete(); // Ensure button becomes clickable even if loading fails
    });

  }, [setModel, setModelLoaded, onLoadingComplete]);

  return (
    <div className="splash-screen">
      <pre className="header">
        <p>Laukaitis OS [Version 2.5.4]</p>
        <p>(C) Laukaitis Corporation. All rights reserved.</p>
      </pre>
      <pre className="logo">
        {`
   __                __         _ __  _      ____  _____
  / /   ____ ___  __/ /______ _(_) /_(_)____/ __ \\/ ___/
 / /   / __ \`/ / / / //_/ __ \`/ / __/ / ___/ / / /\\__ \\ 
/ /___/ /_/ / /_/ / ,  / /_/ / / /_/ (__  ) /_/ /___/ / 
\\____/\\__,_/\\__,_/_/|_|\\__,_/_/\\__/_/____/\\____//____/  
                                                         
        `}
      </pre>
      <div className="system-info">
        <pre ref={infoRef} className="tasks"></pre>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>All systems ready.</p>
            <p> Note: Best experienced on a desktop!</p>
            <button onClick={loadingComplete ? onEnter : null} disabled={!loadingComplete}>
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;

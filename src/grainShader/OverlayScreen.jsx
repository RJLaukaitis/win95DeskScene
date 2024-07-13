import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import screenVert from './vertex.glsl';
import screenFrag from './fragment.glsl';

const OverlayScreen = React.forwardRef((props, ref) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const uniforms = {
      u_time: { value: 1 },
    };

    const overlayMaterial = new THREE.ShaderMaterial({
      vertexShader: screenVert,
      fragmentShader: screenFrag,
      uniforms: uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const overlayGeometry = new THREE.PlaneGeometry(10000, 10000);
    const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlayRef.current = overlayMesh;

    if (ref) {
      ref.current = overlayMesh;
    }

    return () => {
      overlayMesh.geometry.dispose();
      overlayMesh.material.dispose();
    };
  }, [ref]);

  useFrame(() => {
    if (overlayRef.current) {
      overlayRef.current.material.uniforms.u_time.value += 0.01;
    }
  });

  return null;
});

export default OverlayScreen;

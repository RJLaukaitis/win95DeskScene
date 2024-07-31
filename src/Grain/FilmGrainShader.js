import * as THREE from 'three';

const FilmGrainShader = {
  uniforms: {
    u_time: { value: 0 },
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio
    uniform float u_time;
    uniform vec2 iResolution;
    varying vec2 vUv;

    float noise(vec2 xy, float seed) {
      return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
    }

    void main() {
      gl_FragColor = vec4(
        noise(vUv * iResolution, fract(u_time) + 1.0),
        noise(vUv * iResolution, fract(u_time) + 2.0),
        noise(vUv * iResolution, fract(u_time) + 3.0),
        0.01
      );
    }
  `
};

export default FilmGrainShader;

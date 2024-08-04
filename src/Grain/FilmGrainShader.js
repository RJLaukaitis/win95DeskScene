
const FilmGrainShader = {
  uniforms: {
    u_time: { value: 0 },
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    tDiffuse: { value: null }
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

    uniform float u_time;
    uniform vec2 iResolution;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec4 sceneColor = texture2D(tDiffuse, vUv);

      // Increase grainAmount 
      float grainAmount = 0.04; // Adjust this value to control grain intensity
      float noise = random(vUv * u_time) * grainAmount;

      // Add noise to the scene color
      vec3 color = sceneColor.rgb + noise;

      
      color = clamp(color, 0.0, 1.0);

      gl_FragColor = vec4(color, sceneColor.a);
    }
  `
};

export default FilmGrainShader;

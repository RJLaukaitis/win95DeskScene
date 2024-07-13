#ifdef GL_ES
precision mediump float;
#endif

const float PHI = 1.6180339887498948;
uniform float u_time;

float noise(vec2 xy, float seed) {
  return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
}

void main() {
  gl_FragColor = vec4(noise(gl_FragCoord.xy, fract(u_time) + 1.0),
                      noise(gl_FragCoord.xy, fract(u_time) + 2.0),
                      noise(gl_FragCoord.xy, fract(u_time) + 3.0), 0.01);
}
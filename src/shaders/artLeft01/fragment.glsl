  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;




vec3 red    = vec3(0.81, 0.15, 0.15);
vec3 blue   = vec3(0.215, 0.152, 0.615);
vec3 yellow = vec3(0.89, 0.62, 0.26);
vec3 yellowFluo = vec3(0.949,0.90,0.0627);
vec3 white  = vec3(0.89, 0.89, 0.89);
vec3 black  = vec3(0.22, 0.22, 0.22);

void main() {
  vec3 finalColor = white;
finalColor = mix(finalColor, black, step(0.5, vUv.x));
  finalColor = mix(finalColor, red, step(0.55, vUv.x));
  finalColor = mix(finalColor, black, step(0.5, vUv.x) * step(0.45, vUv.y));
  finalColor = mix(finalColor, blue, step(0.55, vUv.x) * step(0.5, vUv.y));

  finalColor = mix(finalColor, black, step(vUv.x, 0.5) * step(vUv.y, 0.24));
  finalColor = mix(finalColor, yellow, step(vUv.x, 0.5) * step(vUv.y, 0.2));

  finalColor = mix(finalColor, black, step(vUv.x, 0.5) * step(0.6, vUv.y) * step(vUv.y, 0.64));
  finalColor = mix(finalColor, black, step(vUv.x, 0.25) * step(0.20, vUv.x) * step(0.64, vUv.y));

  finalColor = mix(finalColor, yellowFluo, step(vUv.x, 0.5) * step(0.25, vUv.x) * step(0.64, vUv.y) * step(vUv.y, 0.82));
  finalColor = mix(finalColor, black, step(vUv.x, 0.5) * step(0.25, vUv.x) * step(0.82, vUv.y) * step(vUv.y, 0.86));
  
  gl_FragColor = vec4(finalColor, 1.0);
}
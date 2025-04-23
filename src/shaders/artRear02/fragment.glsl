uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;

void main() {
 vec2 repeatedUvs = fract(vUv * 8.0 - 0.25);
    float verticalRectangle = step(0.5, repeatedUvs.x) * step(0.35, repeatedUvs.y);
    float horizontalLine = step(0.9, repeatedUvs.y);
    float pct = verticalRectangle + horizontalLine;
    vec3 finalColor = uColor * pct;
    gl_FragColor = vec4(finalColor, 1.0);
}
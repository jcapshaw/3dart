uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
  // Sample the texture
  vec4 texColor = texture2D(uTexture, vUv);
  
  // Apply a subtle animation effect (optional)
  // This creates a very slight pulsing effect on the brightness
  float brightness = 1.0 + sin(uTime * 0.5) * 0.05;
  
  // Apply the brightness adjustment
  vec3 finalColor = texColor.rgb * brightness;
  
  // Output the final color
  gl_FragColor = vec4(finalColor, texColor.a);
}
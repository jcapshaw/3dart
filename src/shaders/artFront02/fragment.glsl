uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;


#include ../includes/cnoise.glsl

  void main() {

    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));
 
  // black & white version
  //  gl_FragColor = vec4(strength,strength,strength, 1.0);

   //Colored Version
   vec3 blackColor = vec3(0.0);
   vec3 uvColor = vec3(vUv, 0.5);
   //mixed color:
   vec3 mixedColor = mix(blackColor,  uvColor, strength);

   gl_FragColor = vec4(mixedColor, 1.0);
   
  }
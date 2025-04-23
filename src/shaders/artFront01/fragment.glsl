uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;





vec3 darkBrown = vec3(0.15, 0.1, 0.05);
vec3 ochre     = vec3(0.8, 0.6, 0.3);
vec3 black     = vec3(0.02);
vec3 highlight = vec3(1.0, 0.85, 0.6);

// Simulación de luz desde un punto
float vignette(vec2 uv) {
    float dist = distance(uv, vec2(0.5));
    return smoothstep(0.7, 0.2, dist);
}

// Ruido para textura "de óleo"
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 st){
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = vUv;

    // Textura tipo óleo
    float n = noise(uv * 8.0 + uTime * 0.02);

    // Iluminación central con textura
    float light = vignette(uv) + n * 0.1;

    // Mezcla de sombras y luces
    vec3 baseColor = mix(darkBrown, ochre, light);
    vec3 finalColor = mix(baseColor, highlight, pow(light, 3.0));

    gl_FragColor = vec4(finalColor, 1.0);
}

   
uniform vec3 uColor;
  uniform float uTime;

  varying vec2 vUv;

// Simple pseudo-random noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Fragmentación tipo cubismo
float cubist(vec2 uv) {
    float strength = 0.0;
    uv *= 10.0;

    vec2 id = floor(uv);
    vec2 f = fract(uv);

    float angle = random(id) * 6.2831;
    vec2 dir = vec2(cos(angle), sin(angle));

    float distortion = dot(f - 0.5, dir);
    strength += step(0.0, distortion) * 0.5;

    return strength;
}

// Generador de colores vivos tipo arcoíris
vec3 vibrantColor(float t) {
    return vec3(
        0.5 + 0.5 * sin(t + 0.0),
        0.5 + 0.5 * sin(t + 2.0),
        0.5 + 0.5 * sin(t + 4.0)
    );
}

// Composición de múltiples capas
void main() {
    vec2 uv = vUv;
    float t = uTime * 0.2;

    // Desplazamiento animado sutil
    uv += 0.03 * sin(uv.yx * 10.0 + t);

    // Composición en blanco y negro
    float layer1 = cubist(uv);
    float layer2 = cubist(uv * 1.5 + 2.0);
    float layer3 = cubist(uv * 0.7 - 1.0);

    float mixVal = mod(layer1 + layer2 + layer3, 1.0);

    vec3 color = vibrantColor(t + mixVal * 6.2831);

    gl_FragColor = vec4(color * mixVal, 1.0);
}
   
precision mediump float;

uniform float uTime;
varying vec2 vUv;

// Función para patrón de olas estilizadas
float wave(vec2 uv, float freq, float speed, float offset) {
    return sin(uv.x * freq + uTime * speed + offset);
}

// Colores planos al estilo Hokusai
vec3 backgroundColor = vec3(0.0, 0.537, 0.482);        // cielo claro
vec3 waveBlue = vec3(0.2, 0.4, 0.8);                // azul Hokusai
vec3 waveShadow = vec3(0.1, 0.2, 0.4);              // sombra de ola
vec3 foamColor = vec3(0.7, 0.7, 0.7);                         // espuma blanca

void main() {
    vec2 uv = vUv;

    // Invertir Y para que el agua esté abajo
    uv.y = 1.0 - uv.y;

    vec3 color = backgroundColor;

    // Capa de ola principal
    float w1 = wave(uv * 3.0, 10.0, 1.0, 0.0);
    if (uv.y < 0.4 + 0.05 * w1) {
        color = waveBlue;
    }

    // Capa de sombra de ola
    float w2 = wave(uv * 4.0, 20.0, 1.5, 1.0);
    if (uv.y < 0.35 + 0.03 * w2) {
        color = waveShadow;
    }

    // Espuma con ruido animado
    float foam = wave(uv * 5.0, 30.0, 3.0, 3.0);
    if (uv.y < 0.38 + 0.015 * foam) {
        color = foamColor;
    }

    gl_FragColor = vec4(color, 1.0);
}
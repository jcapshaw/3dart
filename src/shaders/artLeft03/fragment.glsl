precision mediump float;

uniform float uTime;
varying vec2 vUv;


vec3 blue = vec3(0.1, 0.3, 0.8);
vec3 green = vec3(0.2, 0.8, 0.4);
vec3 red = vec3(0.9, 0.1, 0.1);
vec3 yellow = vec3(1.0, 0.8, 0.1);
vec3 white = vec3(1.0, 1.0, 1.0);
vec3 black = vec3(0.0, 0.0, 0.0);

// Función para crear círculos suaves
float circle(vec2 uv, vec2 center, float radius) {
    return smoothstep(radius, radius - 0.05, distance(uv, center));
}

// Función para crear formas de mosaicos, más orgánicas y fluidas
float mosaicPattern(vec2 uv, vec2 center, float size, float variation) {
    vec2 grid = fract((uv - center) / size);
    return smoothstep(0.05, 0.04, min(grid.x, grid.y) - variation);
}

void main() {
    vec2 uv = vUv;
    vec3 color = white;  // Fondo blanco para emular las bases de los mosaicos

    // Crear mosaicos de colores (simulando los azulejos de Gaudí)
    float mosaic1 = mosaicPattern(uv, vec2(0.25, 0.25), 0.2, sin(uTime * 0.1) * 0.1);
    color = mix(color, red, mosaic1);

    float mosaic2 = mosaicPattern(uv, vec2(0.75, 0.25), 0.2, cos(uTime * 0.1) * 0.1);
    color = mix(color, blue, mosaic2);

    float mosaic3 = mosaicPattern(uv, vec2(0.25, 0.75), 0.2, sin(uTime * 0.1) * 0.1);
    color = mix(color, green, mosaic3);

    float mosaic4 = mosaicPattern(uv, vec2(0.75, 0.75), 0.2, cos(uTime * 0.1) * 0.1);
    color = mix(color, yellow, mosaic4);

    // Añadir círculos grandes con animación
    float w1 = circle(uv, vec2(0.5), 0.3 + 0.05 * sin(uTime));  // Círculo azul
    color = mix(color, blue, w1);

    // Animación de sombra para simular cómo la luz afecta los mosaicos
    vec3 shadow = black * 0.3;
    float shadowEffect = smoothstep(0.4, 0.5, sin(uTime * 0.5));  // Animación suave de sombra
    color = mix(color, shadow, shadowEffect);

    gl_FragColor = vec4(color, 1.0);
}
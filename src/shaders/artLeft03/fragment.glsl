 precision mediump float;

    uniform vec2 uResolution;
    uniform float uTime;
    varying vec2 vUv;

    #define PI 3.14159265359

    vec3 renauPalette(float t) {
        if (t < 0.25) return vec3(0.5, 0.0, 0.5);    //purple
        else if (t < 0.5) return vec3(1.0, 0.9, 0.0); //yellow
        else if (t < 0.75) return vec3(0.9, 0.1, 0.1);// red
       else return vec3(0.0, 0.75, 0.45); // white
    }

    float star(vec2 p, float points, float inner, float outer) {
        float a = atan(p.y, p.x);
        float r = length(p);
        float m = mod(a * points / PI, 2.0);
        float d = mix(inner, outer, step(1.0, m));
        return smoothstep(d, d + 0.01, r);
    }

    float fist(vec2 uv) {
        uv = uv * 2.0 - 1.0;
        float box = step(0.3, abs(uv.x)) * step(0.3, abs(uv.y));
        float thumb = step(length(uv - vec2(-0.5, 0.2)), 0.2);
        return max(1.0 - box, thumb);
    }

    void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        uv.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.5;
        float rays = abs(sin(atan(uv.y, uv.x) * 5.0 + t));
        float circle = smoothstep(0.5, 0.51, length(uv));
        float s = 1.0 - star(uv * 2.0, 5.0, 0.3, 0.5);
        float f = fist(uv);
        float mixVal = max(max(rays * (1.0 - circle), s), f);

        vec3 col = renauPalette(mixVal);
        gl_FragColor = vec4(col, 1.0);
    }
// precision mediump float;

// uniform float uTime;
// varying vec2 vUv;


// vec3 blue = vec3(0.1, 0.3, 0.8);
// vec3 green = vec3(0.2, 0.8, 0.4);
// vec3 red = vec3(0.9, 0.1, 0.1);
// vec3 yellow = vec3(1.0, 0.8, 0.1);
// vec3 white = vec3(1.0, 1.0, 1.0);
// vec3 black = vec3(0.0, 0.0, 0.0);

// // Función para crear círculos suaves
// float circle(vec2 uv, vec2 center, float radius) {
//     return smoothstep(radius, radius - 0.05, distance(uv, center));
// }

// // Función para crear formas de mosaicos, más orgánicas y fluidas
// float mosaicPattern(vec2 uv, vec2 center, float size, float variation) {
//     vec2 grid = fract((uv - center) / size);
//     return smoothstep(0.05, 0.04, min(grid.x, grid.y) - variation);
// }

// void main() {
//     vec2 uv = vUv;
//     vec3 color = white;  // Fondo blanco para emular las bases de los mosaicos

//     // Crear mosaicos de colores (simulando los azulejos de Gaudí)
//     float mosaic1 = mosaicPattern(uv, vec2(0.25, 0.25), 0.2, sin(uTime * 0.1) * 0.1);
//     color = mix(color, red, mosaic1);

//     float mosaic2 = mosaicPattern(uv, vec2(0.75, 0.25), 0.2, cos(uTime * 0.1) * 0.1);
//     color = mix(color, blue, mosaic2);

//     float mosaic3 = mosaicPattern(uv, vec2(0.25, 0.75), 0.2, sin(uTime * 0.1) * 0.1);
//     color = mix(color, green, mosaic3);

//     float mosaic4 = mosaicPattern(uv, vec2(0.75, 0.75), 0.2, cos(uTime * 0.1) * 0.1);
//     color = mix(color, yellow, mosaic4);

//     // Añadir círculos grandes con animación
//     float w1 = circle(uv, vec2(0.5), 0.3 + 0.05 * sin(uTime));  // Círculo azul
//     color = mix(color, blue, w1);

//     // Animación de sombra para simular cómo la luz afecta los mosaicos
//     vec3 shadow = black * 0.3;
//     float shadowEffect = smoothstep(0.4, 0.5, sin(uTime * 0.5));  // Animación suave de sombra
//     color = mix(color, shadow, shadowEffect);

//     gl_FragColor = vec4(color, 1.0);
// }
precision mediump float;

uniform float uTime;
varying vec2 vUv;

void main() {
    vec3 color = vec3(0.0);
    vec2 st = vUv * 2.0 - 1.0;

    // Paleta de colores
    vec3 blue = vec3(0.2, 0.4, 0.8);
    vec3 red = vec3(0.9, 0.1, 0.1);
    vec3 yellow = vec3(1.0, 0.9, 0.2);
    vec3 black = vec3(0.0);
    vec3 white = vec3(1.0);

    // Formas geométricas tipo collage
    float shape1 = step(length(st - vec2(0.3, 0.3)), 0.3);
    float shape2 = step(abs(st.x + st.y), 0.5);
    float shape3 = step(abs(st.x - st.y), 0.2);
    float shape4 = step(length(st + vec2(0.4, 0.2)), 0.25);

    // Mezcla de colores según la forma
    color += mix(black, blue, shape1);
    color = mix(color, red, shape2);
    color = mix(color, yellow, shape3);
    color = mix(color, white, shape4);

    // Sombras dinámicas
    float shadow = smoothstep(0.2, 0.5, sin(uTime + st.x * 10.0) * 0.5 + 0.5);
    color *= shadow;

    gl_FragColor = vec4(color, 1.0);
}
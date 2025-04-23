precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float stripes(vec2 uv, float angle, float freq) {
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    return step(0.5, 0.5 + 0.5 * sin(uv.y * freq));
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Color base futurista
    vec3 baseColor = vec3(0.0, 0.0, 0.05);

    // Líneas dinámicas
    float s1 = stripes(uv * 4.0 + vec2(uTime * 0.3, 0.0), radians(45.0), 20.0);
    float s2 = stripes(uv * 3.0 - vec2(uTime * 0.2, 0.0), radians(-45.0), 15.0);
    float s3 = stripes(uv * 6.0 + vec2(uTime * 0.5, uTime * 0.5), radians(90.0), 40.0);

    // Mezcla de colores tipo neón
    vec3 col1 = vec3(0.1, 0.9, 1.0) * s1;
    vec3 col2 = vec3(1.0, 0.1, 0.9) * s2;
    vec3 col3 = vec3(1.0, 0.9, 0.1) * s3;

    vec3 color = baseColor + col1 + col2 + col3;

    // Resplandor central
    float glow = 0.01 / length(uv - vec2(0.0));
    color += vec3(0.1, 0.3, 0.6) * glow;

    gl_FragColor = vec4(color, 1.0);
}
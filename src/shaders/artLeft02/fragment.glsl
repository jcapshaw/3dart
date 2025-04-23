 uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;

float circle(vec2 uv, vec2 center, float radius, float edge) {
    float dist = length(uv - center);
    return smoothstep(radius + edge, radius - edge, dist);
}

vec3 palette(float t) {
    return vec3(
        0.5 + 0.5 * sin(6.2831 * t + 0.0),
        0.5 + 0.5 * sin(6.2831 * t + 2.0),
        0.5 + 0.5 * sin(6.2831 * t + 4.0)
    );
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0; // Remap to center [-1,1]
    float t = uTime * 0.3;

    vec3 color = vec3(0.0);

    // Draw multiple pulsating rings
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float r = 0.2 + 0.1 * fi + 0.05 * sin(t + fi * 1.2);
        float edge = 0.015;
        float c = circle(uv, vec2(0.0), r, edge);

        vec3 col = palette(fract(t + fi * 0.2));
        color += c * col * (1.0 - fi * 0.15);
    }

    gl_FragColor = vec4(color, 1.0);

}
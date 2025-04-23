#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 bluePalette(float t) {
    return mix(vec3(0.05, 0.1, 0.2), vec3(0.3, 0.5, 0.7), t);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.0);

    // fondo azulado
    color = mix(vec3(0.05, 0.1, 0.2), vec3(0.1, 0.2, 0.4), uv.y + 0.5);

    // forma del cuerpo simplificada
    float body = smoothstep(0.3, 0.25, length(uv - vec2(0.0, -0.2)));
    float leg = smoothstep(0.15, 0.1, length(uv - vec2(-0.3, -0.6)));
    float head = smoothstep(0.1, 0.08, length(uv - vec2(0.1, 0.4)));

    // brazo
    float arm = smoothstep(0.25, 0.2, length(uv - vec2(0.25, 0.0)));

    // guitarra
    float guitar = smoothstep(0.2, 0.18, length(uv - vec2(0.0, 0.0)));

    // pintar cuerpo
    color = mix(color, vec3(0.6, 0.7, 1.0), body);
    color = mix(color, vec3(0.8, 0.9, 1.0), head);
    color = mix(color, vec3(0.3, 0.4, 0.7), leg);
    color = mix(color, vec3(0.7, 0.8, 1.0), arm);

    // pintar guitarra
    color = mix(color, vec3(0.3, 0.2, 0.1), guitar);

    gl_FragColor = vec4(color, 1.0);
}
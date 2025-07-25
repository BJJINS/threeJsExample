uniform vec2 u_resolution;
uniform float u_size;
uniform float u_progress;
uniform vec3 u_colorA;
uniform vec3 u_colorB;

attribute float a_size;
attribute vec3 a_positionTarget;

varying vec3 v_color;

#include "./simplexNoise3d.glsl";

void main() {
    float noiseOrigin = simplexNoise3d(position * 0.2);
    float noiseTarget = simplexNoise3d(a_positionTarget * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, u_progress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;

    v_color = mix(u_colorA, u_colorB, u_progress);
    float progress = smoothstep(delay, end, u_progress);
    vec3 mixedPosition = mix(position, a_positionTarget, progress);

    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = u_size * u_resolution.y * a_size;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
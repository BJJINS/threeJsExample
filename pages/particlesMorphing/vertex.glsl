uniform float u_size;
uniform vec2 u_resolution;
uniform float u_progress;
uniform vec3 u_colorA;
uniform vec3 u_colorB;

attribute float a_size;
attribute vec3 a_targetPosition;

varying vec3 v_color;

#include "./simplexNoise3d.glsl";

void main() {
    float originalNoise = simplexNoise3d(position);
    float targetNoise = simplexNoise3d(a_targetPosition);
    float noise = mix(originalNoise, targetNoise, u_progress);
    noise = smoothstep(-1.0, 1.0, noise);
    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, u_progress);
    vec3 mixedPosition = mix(position, a_targetPosition, progress);
    v_color = mix(u_colorA, u_colorB, noise);

    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    gl_PointSize = u_size * u_resolution.y * a_size;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
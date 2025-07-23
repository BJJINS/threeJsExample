uniform vec2 u_resolution;

void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelViewPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = 0.3 * u_resolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
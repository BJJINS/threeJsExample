uniform vec2 u_resolution;
uniform float u_size;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = u_size * u_resolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
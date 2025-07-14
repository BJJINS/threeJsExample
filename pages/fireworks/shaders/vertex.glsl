uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;
void main() {
    vec3 newPosition = position;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uResolution.y * aSize;
    // 给粒子添加透视效果（使其在远处看起来更小）
    gl_PointSize *= 1.0 / -viewPosition.z;
}
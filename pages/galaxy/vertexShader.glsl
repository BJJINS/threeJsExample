uniform float uTime;
uniform float uSize;
attribute vec3 aRandomness;

attribute float aScale;
varying vec3 vColor;

void main() {
    vColor = color;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = atan(modelPosition.z, modelPosition.x);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
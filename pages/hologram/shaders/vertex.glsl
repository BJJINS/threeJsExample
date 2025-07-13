uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

// 获取随机数，相同的输入会有相同的输出 [0-1]
float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0); // 取消平移
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
}
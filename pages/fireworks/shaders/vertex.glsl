uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

#include ../../utils;


void main() {
    vec3 newPosition = position;
    
    // 爆炸进度 0 - 0.1
    float explodingProgress = remap(uProgress, 0.0, 0.1, 0.0, 1.0);
    // clamp(x, minVal, maxVal) 如果 x 小于 minVal，则返回 minVal；如果 x 大于 maxVal，则返回 maxVal；否则返回 x
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    // 让explodingProgress从0-1的变化过程先快后慢
    // https://www.desmos.com/calculator?lang=zh-CN 网站可以看到对应的曲线图。公式：1-(1-x)^3;
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    // 粒子下落阶段 0.1 - 1.0
    float fallingProgress = remap(fallingProgress, 0.1, 1.0, 0.0, 1.0);






    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uResolution.y * aSize;
    // 给粒子添加透视效果（使其在远处看起来更小）
    gl_PointSize *= 1.0 / -viewPosition.z;
}
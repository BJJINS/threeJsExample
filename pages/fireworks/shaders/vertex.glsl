uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;
attribute float aTimeMultiplier;

attribute float aSize;

#include ../../shaders/remap;

void main() {
    vec3 newPosition = position;
    float progress = uProgress * aTimeMultiplier;
    // 爆炸进度 0 - 0.1
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    // clamp(x, minVal, maxVal) 如果 x 小于 minVal，则返回 minVal；如果 x 大于 maxVal，则返回 maxVal；否则返回 x
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    // 让explodingProgress从0-1的变化过程先快后慢
    // https://www.desmos.com/calculator?lang=zh-CN 网站可以看到对应的曲线图。公式：1-(1-x)^3;
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    // 粒子下落阶段 0.1 - 1.0
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    // 烟花绽放阶段 0.0 - 0.125
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    // 烟花绽放后缩小 0.125 - 1.0
    float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    // 烟花闪烁
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
    // 给粒子添加透视效果（使其在远处看起来更小）
    gl_PointSize *= 1.0 / -viewPosition.z;


    // 粒子小于1pxGpu很难处理，当粒子小于等于1px时，gpu将粒子按照1px处理。
    // 所以这里直接将粒子移到画面之外，这样粒子就不会被渲染。
    if(gl_PointSize < 1.0) {
        gl_Position = vec4(999.0);
    }
}
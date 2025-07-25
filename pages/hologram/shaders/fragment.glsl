uniform float uTime;
uniform vec3 uColor;
varying vec3 vPosition;
varying vec3 vNormal;
void main() {
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }
    // 添加条纹
    float strips = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    strips = pow(strips, 2.0);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    // 中间暗，边缘亮
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
    float holographic = fresnel * strips;
    // 边缘模糊
    float falloff = smoothstep(0.8, 0.0, fresnel);
    holographic += fresnel * 1.25;
    holographic *= falloff;
    gl_FragColor = vec4(uColor, holographic);

    // 用于模拟人眼在不同光照条件下的视觉感知，主要用于 HDR（高动态范围）渲染。
    // 它将场景中的高动态范围颜色值映射到标准的 LDR（低动态范围）显示器上，使亮部不过曝，暗部不失真，同时保留丰富的色彩和细节。
    #include <tonemapping_fragment>
    // 转换颜色，以符合渲染器的色彩空间设置
    #include <colorspace_fragment>
}
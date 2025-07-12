uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;
    float smoke = texture(uPerlinTexture, smokeUv).r;
    smoke  = smoothstep(0.4, 1.0, smoke);

    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= 1.0 - smoothstep(0.9, 1.0, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= 1.0 - smoothstep(0.6, 1.0, vUv.y);



    gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);

    // 用于模拟人眼在不同光照条件下的视觉感知，主要用于 HDR（高动态范围）渲染。
    // 它将场景中的高动态范围颜色值映射到标准的 LDR（低动态范围）显示器上，使亮部不过曝，暗部不失真，同时保留丰富的色彩和细节。
    #include <tonemapping_fragment>
    // 转换颜色，以符合渲染器的色彩空间设置
    #include <colorspace_fragment>
}
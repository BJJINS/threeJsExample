#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

/**
    可以把这个函数想象成 "画笔画线" 的规则：当像素的 y 坐标（st.y）接近目标线条的 y 坐标（pct）时，就把这个像素染成线条颜色。
    smoothstep(a, b, x) 是一个平滑过渡函数：当 x <a 时返回 0，x> b 时返回 1，中间部分平滑过渡（类似渐变色的 "模糊边缘" 效果）。
    两个 smoothstep 相减，会在pct位置形成一个宽度为 0.02 的 "高亮带"（中间值为 1，向两边逐渐减到 0），就像用毛笔轻轻画一条线，中间粗、边缘淡。
*/
float plot(vec2 st, float pct) {
    return smoothstep(pct - 0.01, pct, st.y) -
        smoothstep(pct, pct + 0.01, st.y);
}
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);
    color = mix(color, vec3(1.0, 0.0, 0.0), plot(uv, smoothstep(0.0, 1.0, uv.x)));
    color = mix(color, vec3(0.0, 1.0, 0.0), plot(uv, sin(uv.x * 3.1415926)));
    color = mix(color, vec3(0.0, 0.0, 1.0), plot(uv, cos(uv.x * 3.1415926)));

    gl_FragColor = vec4(color, 1.0);
}
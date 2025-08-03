#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;

#define PI 3.14159
#define LINE_THICKNESS 0.02

// 计算当前像素的y坐标与目标函数y的垂直距离
float plot(vec2 st, float y) {
    float distance = abs(st.y - y);
    // 用smoothstep实现抗锯齿线条（阈值控制线条粗细）
    return 1.0 - smoothstep(0.0, LINE_THICKNESS, distance);
}

// 直线（y = mx + b）
float plotLine(vec2 st, float m, float b) {
    float y = m * st.x + b;
    return plot(st, y);
}

// 圆形
// radius 半径
// center 圆心
float plotCircle(vec2 st, vec2 center, float radius, bool isFilled) {
 // 计算当前点到圆心的距离
    float dist = length(st - center);
    float outerEdge = 1.0 - smoothstep(radius - 0.01, radius + 0.01, dist);
    if(isFilled) {
        // 实心圆：距离小于半径的部分都填充
        // 使用smoothstep实现边缘抗锯齿
        return outerEdge;
    } else {
        // 空心圆：只保留距离在[radius-LINE_THICKNESS, radius]范围内的部分
        float inner = radius - LINE_THICKNESS;
        float innerEdge = smoothstep(inner - 0.01, inner + 0.01, dist);
        return outerEdge * innerEdge;
    }
}

float plotCircle(vec2 st, vec2 center, float radius) {
    return plotCircle(st, center, radius, false);
}

float plotRect(vec2 st, vec2 leftBottom, vec2 rightTop, bool isFilled) {
    // d 计算边界
    // 如果st.x > leftBottom && st.x < rightTop 那么d.x必定是负数，反之则是正数
    // y轴同理
    // 这里取max是为了获取st的xy距离矩形最小的距离
    vec2 d = max(leftBottom - st, st - rightTop);
    float outDist = length(max(d, 0.0));
    float outEdge = 1.0 - smoothstep(0.0, 0.01, outDist);
    if(isFilled) {
        // 如果st在矩形里面，则xy都是负数，distance是0
        return outEdge;
    } else {
        float innerDist = abs(max(d.x, d.y));
        float innerEdge = 1.0 - smoothstep(0.0, LINE_THICKNESS + 0.01, innerDist);
        return innerEdge * outEdge;
    }
}

float plotRect(vec2 st, vec2 leftBottom, vec2 rightTop) {
    return plotRect(st, leftBottom, rightTop, false);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = uv * 4.0 * 3.14159 - 2.0 * 3.14159;  // 范围变为[-2π, 2π]
    st.x *= aspect; // 让 x 方向的单位长度与 y 方向保持一致 防止宽高比倒置图像变形

    vec3 color = vec3(1.0);
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 black = vec3(0.0);

    // xy 轴线
    color = mix(color, black, plot(st, 0.0) + plot(st.yx, 0.0));

    float y = sin(st.x);
    color = mix(color, red, plot(st, y));
    y = cos(st.x);
    color = mix(color, red, plot(st, y));

    float line = plotLine(st, 1.0, 0.0);
    float circle = plotCircle(st, vec2(0.0, 0.0), 1.0);
    color = mix(color, vec3(0.0, 1.0, 0.0), circle);

    color = mix(color, vec3(0.0, 0.0, 1.0), plotRect(st, vec2(0.0), vec2(1.0)));

    gl_FragColor = vec4(color, 1.0);
}
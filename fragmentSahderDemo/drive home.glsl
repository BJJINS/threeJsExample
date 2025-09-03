struct ray {
    vec3 origin; // 射线原点相机位置
    vec3 direction; // 射线方向
};

// 光线追踪
ray getRay(vec2 uv, vec3 camPos, vec3 lookAt, float room) {
    ray a;
    a.origin = camPos;

    vec3 forward = normalize(lookAt - camPos);
    vec3 right = cross(forward, vec3(0.0, 1.0, 0.0));
    vec3 up = cross(right, forward);
    vec3 c = a.origin + forward * room; // 将相机位置沿前方向移动 room 距离，得到近平面中心坐标
    vec3 i = c + uv.x * right + uv.y * up; // 计算近平面上的采样点（射线目标点）
    a.direction = normalize(i - a.origin);

    return a;
}

vec3 closestPoint(ray r, vec3 p) {
    return r.origin + max(0.0, dot(p - r.origin, r.direction)) * r.direction;
}

float distRay(ray r, vec3 p) {
    return length(p - closestPoint(r, p));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv -= 0.5;
    uv *= 2.0;
    uv.x *= iResolution.x / iResolution.y;

    vec3 camPos = vec3(0.0, 0.0, 0.0);
    vec3 lookAt = vec3(0.0, 0.0, -1.0);
    ray r = getRay(uv, camPos, lookAt, 2.0);

    vec3 p = vec3(2.5, 0.0, -5.0);
    float d = distRay(r, p);
    float c = smoothstep(0.1, 0.09, d);

    gl_FragColor = vec4(c);
}

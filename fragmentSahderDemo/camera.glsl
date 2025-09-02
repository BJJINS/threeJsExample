float DistLine(vec3 ro, vec3 rd, vec3 p) {
    return length(cross(p - ro, rd)) / length(rd);
}

float DrawPoint(vec3 ro, vec3 rd, vec3 p) {
    return smoothstep(0.06, 0.05, DistLine(ro, rd, p));
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, -3.0); // (ray origin): 射线原点
    vec3 rd = vec3(uv.x, uv.y, -2.0) - ro; // (ray direction): 射线方向
    vec3 lookAt = vec3(0.5);
    vec3 f = lookAt - ro;
    


    float t = iGlobalTime;
    float d = 0.0;
    d += DrawPoint(ro, rd, vec3(0.0, 0.0, 0.0));
    d += DrawPoint(ro, rd, vec3(0.0, 0.0, 1.0));
    d += DrawPoint(ro, rd, vec3(0.0, 1.0, 0.0));
    d += DrawPoint(ro, rd, vec3(0.0, 1.0, 1.0));
    d += DrawPoint(ro, rd, vec3(1.0, 0.0, 0.0));
    d += DrawPoint(ro, rd, vec3(1.0, 0.0, 0.0));
    d += DrawPoint(ro, rd, vec3(1.0, 1.0, 0.0));
    d += DrawPoint(ro, rd, vec3(1.0, 1.0, 1.0));
    vec3 col = vec3(d);
    fragColor = vec4(col, 1.0);
}

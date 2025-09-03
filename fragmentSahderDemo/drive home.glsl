struct ray {
    vec3 o;
    vec3 d;
};

ray getRay(vec2 uv, vec3 camPos, vec3 lookAt, float room) {
    ray a;
    a.o = camPos;

    vec3 f = normalize(lookAt - camPos);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);
    vec3 c = a.o + f * room;
    vec3 i = c + uv.x * r + uv.y * u;
    a.d = normalize(i - a.o);

    return a;
}

vec3 closestPoint(ray r, vec3 p) {
    return r.o + max(0.0, dot(p - r.o, r.d)) * r.d;
}

float distRay(ray r, vec3 p) {
    return length(p - closestPoint(r, p));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;

    vec3 camPos = vec3(0.0, 0.2, 0.0);
    vec3 lookAt = vec3(0.0, 0.2, 1.0);
    ray r = getRay(uv, camPos, lookAt, 1.0);

    vec3 p = vec3(0.0, 0.0, 5.0);
    float d = distRay(r, p);
    // float c = smoothstep(0.1, 0.09, d);

    gl_FragColor = vec4(d);
}
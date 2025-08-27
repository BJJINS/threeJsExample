vec2 ratio(in vec2 v, in vec2 s) {
    return mix(
        vec2(v.x * s.x / s.y - (s.x - s.y) * 0.5 / s.y, v.y),
        vec2(v.x, v.y * s.y / s.x - (s.y - s.x) * 0.5 / s.x),
        step(s.x, s.y)
    );
}

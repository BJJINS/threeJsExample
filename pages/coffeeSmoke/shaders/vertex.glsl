uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {
    vUv = uv;
    vec3 newPosition = position;
    float twistPerlin = texture(uPerlinTexture, vec2(0.5, vUv.y * 0.2 - uTime * 0.005)).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    vec2 wind = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5, 
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    wind *= pow(uv.y, 3.0) * 10.0;
    newPosition.xz += wind;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
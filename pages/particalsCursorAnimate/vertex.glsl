uniform vec2 u_resolution;
uniform sampler2D u_pictureTexture;
uniform sampler2D u_displacementTexture;

attribute float a_intensity;
attribute float a_angle;
varying vec3 v_color;

void main() {
    vec3 newPosition = position;
    float displacementIntensity = texture(u_displacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
    vec3 displacement = vec3(cos(a_angle) * 0.2, sin(a_angle) * 0.2, 1.0);
    displacement *= displacementIntensity * 3.0 * a_intensity;
    newPosition += displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    float pictureIntensity = texture(u_pictureTexture, uv).r;
    v_color = vec3(pow(pictureIntensity, 2.0));

    gl_PointSize = 0.15 * u_resolution.y * pictureIntensity;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
uniform vec2 uResolution;
uniform sampler2D uPictureTexture;

varying vec3 vColor;

void main() {
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float pictureIntensity = texture(uPictureTexture, uv).r;
    vColor = vec3(pow(pictureIntensity, 2.0));

    // Point size
    gl_PointSize = 0.15 * uResolution.y * pictureIntensity;
    // 给粒子添加透视效果（使其在远处看起来更小）
    gl_PointSize *= (1.0 / -viewPosition.z);
}
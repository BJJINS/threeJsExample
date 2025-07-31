uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uParticlesTexture;

attribute float aRandomSize;
attribute vec2 aUv;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
    vec4 particle = texture(uParticlesTexture, aUv);
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float fadeIn = smoothstep(0.0, 0.2, particle.a);
    float fadeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
    float fade = min(fadeIn, fadeOut);

    gl_PointSize = uSize * uResolution.y * aRandomSize * fade;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = aColor;
}
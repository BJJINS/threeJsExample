uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uParticlesTexture;

attribute vec2 aParticlesTextureUv;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
    vec4 particle = texture(uParticlesTexture, aParticlesTextureUv);
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = aColor;
}
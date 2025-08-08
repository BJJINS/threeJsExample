uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#include "../shaders/simplexNoise2d.glsl";

void main() {
    vec3 color = vec3(1.);
    float surfaceWaterMix = smoothstep(-1., -.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    float sandMix = step(-.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    float grassMix = step(-.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    float rockMix = vUpDot;
    rockMix = 1. - step(0.8, rockMix);
    rockMix *= step(- .06, vPosition.y);
    color = mix(color, uColorRock, rockMix);

    float snowThreshold = .45;
    snowThreshold += simplexNoise2d(vPosition.xz * 15.) * .1;
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color, uColorSnow, snowMix);

    csm_DiffuseColor = vec4(color, 1.);
}

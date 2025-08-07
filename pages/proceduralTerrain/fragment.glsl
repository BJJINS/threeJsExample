uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;

void main() {
    vec3 color = vec3(1.);
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    float sandMix = step(-0.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    float grassMix = step(-0.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    float snowMix = step(0.45, vPosition.y);
    color = mix(color, uColorSnow, snowMix);



    csm_DiffuseColor = vec4(color, 1.);
}

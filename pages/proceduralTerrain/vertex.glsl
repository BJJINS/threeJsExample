uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;
uniform float uTime;

varying vec3 vPosition;
varying float vUpDot;

#include "./simplexNoise2d.glsl";

float getElevation(vec2 position) {
    vec2 warpPosition = position;
    warpPosition += uTime * .2;
    warpPosition += simplexNoise2d(warpPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    float elevation = .0;
    elevation += simplexNoise2d(warpPosition * uPositionFrequency) / 2.;
    elevation += simplexNoise2d(warpPosition * uPositionFrequency * 2.) / 4.;
    elevation += simplexNoise2d(warpPosition * uPositionFrequency * 4.) / 8.;
    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.) * elevationSign;
    elevation *= uStrength;
    return elevation;
}

void main() {
    float shift = .01;
    vec3 positionA = position.xyz + vec3(shift, .0, .0);
    vec3 positionB = position.xyz + vec3(.0, .0, -shift);
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y += elevation;
    positionA.y += getElevation(positionA.xz);
    positionB.y += getElevation(positionB.xz);
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    vPosition = csm_Position;
    vPosition.xz += uTime * .2;

    vUpDot = dot(csm_Normal, vec3(0., 1., 0.));
}

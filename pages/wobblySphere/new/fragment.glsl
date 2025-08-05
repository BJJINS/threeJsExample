uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;
void main() {
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, smoothstep(-1., 1., vWobble));
}

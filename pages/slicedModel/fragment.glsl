uniform float uSliceStart;
uniform float uSliceArc;
varying vec3 vPosition;
void main() {
    float csm_Slice;
    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI2);

    if (angle < uSliceArc)
        discard;
}

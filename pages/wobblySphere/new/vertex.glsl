#include "../../shaders/simplexNoise4d.glsl";
void main() {
    float wobble = simplexNoise4d(vec4(csm_Position, .0));
    csm_Position += wobble * normal;
}

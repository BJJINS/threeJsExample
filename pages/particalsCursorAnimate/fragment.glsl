varying vec3 v_color;

void main() {

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if(distanceToCenter > 0.5) {
        discard;
    }
    gl_FragColor = vec4(v_color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
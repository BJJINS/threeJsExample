varying vec3 vColor;
void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if(distanceToCenter > 0.5) {
       discard;
    } 
    // float alpha = smoothstep(0.3, 0.0, distanceToCenter);
    // gl_FragColor = vec4(vColor, );
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
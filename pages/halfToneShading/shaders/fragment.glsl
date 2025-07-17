uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include "../../shaders/ambientLight.glsl";
#include "../../shaders/directionalLight.glsl";

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
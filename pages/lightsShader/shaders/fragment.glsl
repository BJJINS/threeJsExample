uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../../shaders/ambientLight;
#include ../../shaders/directionalLight;
#include ../../shaders/pointLight;

void main() {
    vec3 color = uColor;
    // 摄像机到顶点的方向向量，用来展示高光
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 0.03);
    // 法线的长度不一定是1
    vec3 normal = normalize(vNormal);
    light += directionalLight(vec3(0.1, 0.1, 1.0), 1.0, normal, vec3(0.0, 0.0, 3.0), viewDirection, 20.0);
    light += pointLight(vec3(1.0, 0.1, 0.1), 1.0, normal, vec3(0.0, 2.5, 0.0), viewDirection, 20.0, vPosition, 0.3);
    color *= light;
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);

    float sunOrientation = dot(uSunDirection, normal);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    vec2 specularCloud = texture(uSpecularCloudsTexture, vUv).rg;

    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    float cloudMix = smoothstep(0.5,1.0, specularCloud.g);
    color = mix(nightColor, dayColor, dayMix);
    color = mix(color, vec3(1.0), cloudMix * dayMix);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
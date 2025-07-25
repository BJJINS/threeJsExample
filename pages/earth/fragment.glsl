uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);
    vec3 dayColor = texture(uDayTexture, vUv).xyz;
    vec3 nightColor = texture(uNightTexture, vUv).xyz;
    vec2 specularClouds = texture(uSpecularCloudsTexture, vUv).rg;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float sunOrientation = dot(normal, uSunDirection);
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereMix);
    float fresnel = dot(viewDirection, normal) + 1.0; // 菲涅尔效应
    fresnel = pow(fresnel, 2.0);

    float specularCloudMix = smoothstep(0.5, 1.0, specularClouds.y);
    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = dot(reflection, -viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularClouds.r;
    vec3 specularColor = mix(vec3(1.0),atmosphereColor,fresnel);

    color = mix(nightColor, dayColor, dayMix);
    color = mix(color, vec3(1.0), specularCloudMix * sunOrientation);
    color = mix(color, atmosphereColor, atmosphereMix * fresnel);
    color += specular * specularColor;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
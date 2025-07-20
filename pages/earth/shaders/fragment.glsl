uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudTexture;
uniform vec3 uSunDirection;

uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);
    float fresnel = dot(viewDirection, normal) + 1.0; // 菲涅尔效应
    fresnel = pow(fresnel, 2.0);
    float sunOrientation = dot(normal, uSunDirection);
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    vec2 specularCloudColor = texture(uCloudTexture, vUv).rg;
    float cloudMix = smoothstep(0.5, 1.0, specularCloudColor.g);

    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularCloudColor.r; // 只有海洋有太阳的反射光
    vec3 specularColor = mix(vec3(1.0),atmosphereColor,fresnel);

    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;

    color = mix(nightColor, dayColor, dayMix);
    color = mix(color, vec3(1.0), cloudMix * dayMix); // 云
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    color += specular * specularColor;


    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
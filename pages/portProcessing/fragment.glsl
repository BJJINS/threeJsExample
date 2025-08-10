uniform sampler2D tDiffuse;
uniform sampler2D uNormalMap;

varying vec2 vUv;
void main() {
    vec3 normalColor = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    vec2 newUv = vUv + normalColor.xy * 0.1;
    vec4 color = texture2D(tDiffuse, newUv);
    vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
    float lightIntensity = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
    color += 2.0 * lightIntensity;
    gl_FragColor = color;
}

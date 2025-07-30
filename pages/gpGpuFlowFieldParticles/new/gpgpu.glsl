uniform float u_time;


#include "./simplexNoise4d.glsl";
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(u_particlesTexture, uv);
    vec3 flowField = vec3(
        simplexNoise4d(vec4(particle.xyz + 0.0, u_time)),
        simplexNoise4d(vec4(particle.xyz + 1.0, u_time)),
        simplexNoise4d(vec4(particle.xyz + 2.0, u_time))
    );
    flowField = normalize(flowField);
    particle.xyz += flowField;
    gl_FragColor = particle;
}
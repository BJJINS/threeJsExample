uniform float u_size;
uniform vec2 u_resolution;
uniform sampler2D u_particlesTexture;

attribute vec3 a_color;
attribute vec2 a_uv;

varying vec3 v_color;


void main(){
    vec4 particle = texture(u_particlesTexture,a_uv);

    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    gl_PointSize = u_size * u_resolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);

    v_color = a_color;
}
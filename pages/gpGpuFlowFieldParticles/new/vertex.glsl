uniform float u_size;
uniform vec2 u_resolution;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = u_size * u_resolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
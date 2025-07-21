varying vec3 vNormal;
varying vec2 vUv;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vUv = uv;
}
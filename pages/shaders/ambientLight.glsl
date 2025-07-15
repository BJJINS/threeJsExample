/**
    环境光
    @param color 环境光颜色
    @param intensity 环境光强度
*/
vec3 ambientLight(vec3 color, float intensity) {
    return color * intensity;
}
/**
    平行光
    @param color 环境光颜色
    @param intensity 环境光强度
    @param normal 当前照射面的法向量
    @param position 光源位置 用来计算光的照射方向
    @param viewDirection 摄像机看向顶点的方向向量
    @param specularPower 高光|反射光强度
*/
vec3 directionLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 viewDirection, float specularPower) {
    vec3 lightDirection = normalize(position);
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // 光的镜面反射的方向。
    // reflect的第一个参数I必须是光源指向顶点的方向,所以这里加负号。
    // reflect的返回向量方向，确是由顶点出发的。这里需要注意，不然效果刚好相反。
    vec3 lightReflection = reflect(-lightDirection, normal);
    // viewDirection需要取反和lightReflection方向一致。
    // specular 反射光｜高光强度
    float specular = dot(-viewDirection, lightReflection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    return color * intensity * (shading + specular);
}
void main() {
    // gl_PointCoord是 WebGL 着色器语言（GLSL）中的一个内置变量，用于处理点精灵（Point Sprites）的渲染。点精灵是一种始终面向相机的四边形
    // 表示点精灵内部的纹理坐标。其取值范围是从(0, 0)（左下角）到(1, 1)（右上角）。通过这个变量，你可以在着色器中为点精灵的不同部分设置不同的颜色或透明度，从而创建各种效果，如渐变、纹理映射等。

    float strength = distance(gl_PointCoord, vec2(0.5));
    // strength > 0.5 是1反之是0
    // strength = step(0.5, strength);

    strength  = 1.0- strength;
    strength = pow(strength,5.0);
    gl_FragColor = vec4(vec3(strength), 1.0);
}
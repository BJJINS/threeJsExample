varying vec3 v_color;

void main() {
    // 让粒子中间更亮而四周更暗
    float distanceToCenter = length(gl_PointCoord - 0.5);
    // https://www.desmos.com/calculator?lang=zh-CN输入公式y=a/x-a*2
    // 观察公式曲线，x是0.5的时候y是0，x越接近0，y越接近1
    // 所以distanceToCenter越接近0，alpha越接近1
    float alpha = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(v_color,alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
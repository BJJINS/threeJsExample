import * as THREE from "three";
import { camera, gui, scene, canvas, renderer } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragShader.glsl";
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, canvas);

const parameters = {
    count: 200000,
    size: 0.005,
    radius: 5,
    branches: 3,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984"
};

let geometry, material, points;


const generateGalaxy = () => {

    if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }


    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);
    const randomness = new Float32Array(parameters.count * 3);

    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius;

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngle) * radius;

        randomness[i3] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        // Color
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    material = new THREE.ShaderMaterial({
        depthWrite: false, // 禁用深度写入，防止粒子之间相互遮挡，确保所有粒子都参与混合。
        blending: THREE.AdditiveBlending, // 启用加法混合模式。多个发光物体叠加时会变得更亮。
        vertexColors: true, // vertex Shader 中将会自动加上 attribute vec3 color;这个代码。 值对应 geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        transparent: true, // 必须启用透明度，否则混合效果可能不正常。
        uniforms: {
            // 乘以像素比是为了让不同像素比的用户看到相同的渲染结果，
            // 不能直接用 window.devicePixelRatio 因为限制了像素比最大是2
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 }
        },
        vertexShader,
        fragmentShader
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

gui.add(parameters, "count").min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, "size").min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "radius").min(1).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "branches").min(1).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "randomness").min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "randomnessPower").min(1).max(10).step(0.01).onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);


const clock = new THREE.Clock();
function render() {
    const elapsed = clock.getElapsedTime();
    if (material) {
        material.uniforms.uTime.value = elapsed;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
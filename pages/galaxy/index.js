import * as THREE from "three";
import { gui, render, scene ,camera} from "../template";
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.72,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984"
};

let geometry, material, points;


const generateGalaxy = () => {

    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);

    if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }


    geometry = new THREE.BufferGeometry();
    const position = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const angle = 2 * Math.PI * (i % parameters.branches) / parameters.branches;
        const radius = Math.random() * parameters.radius;
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;


        const spinAngle = radius * parameters.spin;
        position[i3] = Math.cos(angle + spinAngle) * radius + randomX;
        position[i3 + 1] = randomY;
        position[i3 + 2] = Math.sin(angle + spinAngle) * radius + randomZ;



        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;


    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(position, 3)
    );
    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

gui.add(parameters, "count").min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, "size").min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "radius").min(1).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "branches").min(1).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "spin").min(-5).max(5).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "randomness").min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "randomnessPower").min(1).max(10).step(0.01).onFinishChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

render();
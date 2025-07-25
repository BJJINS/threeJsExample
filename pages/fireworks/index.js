import gsap from "gsap";
import * as THREE from "three";
import { Sky } from "three/examples/jsm/Addons.js";
import { camera, gui, renderer, scene, textureLoader, size as winSize } from "../template";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";


camera.position.set(1.5, 0, 6);
camera.lookAt(0, 0, 0);



const textures = [
    textureLoader.load(import.meta.resolve("./static/particles/1.png")),
    textureLoader.load(import.meta.resolve("./static/particles/2.png")),
    textureLoader.load(import.meta.resolve("./static/particles/3.png")),
    textureLoader.load(import.meta.resolve("./static/particles/4.png")),
    textureLoader.load(import.meta.resolve("./static/particles/5.png")),
    textureLoader.load(import.meta.resolve("./static/particles/6.png")),
    textureLoader.load(import.meta.resolve("./static/particles/7.png")),
    textureLoader.load(import.meta.resolve("./static/particles/8.png")),
];


const fireworkPosition = new THREE.Vector3();
const spherical = new THREE.Spherical();

const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.95,
    elevation: -2.2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);

}

gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
gui.add(effectController, 'elevation', 0, 90, 0.01).onChange(guiChanged);
gui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

guiChanged();





/**
 * 创建一个烟花
 * @param {number} count 烟花中粒子的数量
 * @param {THREE.Vector3} position 烟花的中心位置
 * @param {THREE.Texture} texture
 * @param {number} radius 烟花半径
 * @param {THREE.Vector3} color 烟花颜色
 */
const createFirework = (count, position, size, texture, radius, color) => {
    const positionsArray = new Float32Array(count * 3);
    const timeMultipliersArray = new Float32Array(count);
    const sizesArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        // 随机创建烟花粒子的位置，让这些粒子的位置像个球一样
        spherical.set(radius * (0.75 + Math.random() * 0.25), Math.random() * Math.PI, Math.random() * Math.PI * 2);
        fireworkPosition.setFromSpherical(spherical);

        const i3 = i * 3;
        positionsArray[i3] = fireworkPosition.x;
        positionsArray[i3 + 1] = fireworkPosition.y;
        positionsArray[i3 + 2] = fireworkPosition.z;

        timeMultipliersArray[i] = 1 + Math.random();

        // 每个粒子的大小
        sizesArray[i] = Math.random();

    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));
    geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1));


    // 翻转纹理，纹理的位置上下颠倒
    texture.flipY = false;
    const material = new THREE.ShaderMaterial({
        depthWrite: false,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uResolution: new THREE.Uniform(winSize.resolution),
            uSize: new THREE.Uniform(size),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        }
    });
    const firework = new THREE.Points(geometry, material);
    firework.position.copy(position);
    scene.add(firework);

    // 动画 3s 执行完，uProgress 0 - 1
    gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
            // 动画完成后清理掉烟花
            scene.remove(firework);
            geometry.dispose();
            material.dispose();
        }
    });
};

const createRandomFirework = () => {
    const count = Math.round(400 + Math.random() * 1000);
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random(),
        (Math.random() - 0.5) * 3
    );
    const size = 0.1 + Math.random() * 0.1;
    const texture = textures[Math.floor(Math.random() * textures.length)];
    const radius = 2 + Math.random();
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1, 0.7);
    createFirework(count, position, size, texture, radius, color);
};


window.addEventListener("click", createRandomFirework);

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
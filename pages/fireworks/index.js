import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, size as winSize, textureLoader } from "../template";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";
import gsap from "gsap";


camera.position.set(1.5, 0, 6);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
scene.add(new THREE.AxesHelper(1));


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
/**
 * 创建一个烟花
 * @param {number} count 烟花中粒子的数量
 * @param {THREE.Vector3} position 烟花的中心位置
 * @param {THREE.Texture} texture
 * @param {number} radius 烟花半径
 * @param {THREE.Vector3} color 烟花颜色
 */
const createFireworks = (count, position, size, texture, radius, color) => {
    const positionsArray = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        spherical.set(radius * (0.75 + Math.random() * 0.25), Math.random() * Math.PI, Math.random() * Math.PI * 2);
        fireworkPosition.setFromSpherical(spherical);

        const i3 = i * 3;
        positionsArray[i3] = fireworkPosition.x;
        positionsArray[i3 + 1] = fireworkPosition.y;
        positionsArray[i3 + 2] = fireworkPosition.z;

        sizesArray[i] = Math.random();

    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizesArray, 1));

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
    const point = new THREE.Points(geometry, material);
    point.position.copy(position);
    scene.add(point);

    gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
            
        }
    });
};

createFireworks(
    1000,
    new THREE.Vector3(0, 0, 0),
    0.2,
    textures[7],
    1,
    new THREE.Vector3(1.0, 0.0, 1.0)
);

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
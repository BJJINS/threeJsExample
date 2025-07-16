import * as THREE from "three";
import "./style.css";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
/**
 * @type {HTMLCanvasElement}
 */
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

export const gui = new GUI();
gui.close();

export const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
};

size.resolution = new THREE.Vector2(size.width * size.pixelRatio, size.height * size.pixelRatio);

export const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

export const scene = new THREE.Scene();

export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: size.pixelRatio < 2
});
renderer.setPixelRatio(size.pixelRatio);
renderer.setSize(size.width, size.height);

// 画布跟随窗口变化
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    size.pixelRatio = Math.min(window.devicePixelRatio, 2);
    size.resolution.set(size.width * size.pixelRatio, size.height * size.pixelRatio);

    renderer.setPixelRatio(size.pixelRatio);
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
});

export const textureLoader = new THREE.TextureLoader();
export const gltfLoader = new GLTFLoader();
export const cubeTextureLoader = new THREE.CubeTextureLoader();

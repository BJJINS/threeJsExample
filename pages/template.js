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

const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
export const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

export const scene = new THREE.Scene();

const pixelRatio = Math.min(window.devicePixelRatio, 2);
export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: pixelRatio < 2
});
renderer.setPixelRatio(pixelRatio);
renderer.setSize(size.width, size.height);

// 画布跟随窗口变化
window.onresize = function () {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
};



export const textureLoader = new THREE.TextureLoader();
export const gltfLoader = new GLTFLoader();
export const cubeTextureLoader = new THREE.CubeTextureLoader();

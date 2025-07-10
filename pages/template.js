import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css"
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
export const camera = new THREE.PerspectiveCamera(50, size.width / size.height, 0.1, 100);
camera.position.z = 6;

export const scene = new THREE.Scene();

export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

const axes = new THREE.AxesHelper(10);
scene.add(axes);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;


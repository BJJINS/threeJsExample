import * as THREE from "three";
import "./style.css";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
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

export const renderer = new THREE.WebGLRenderer({
    canvas,
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

export function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

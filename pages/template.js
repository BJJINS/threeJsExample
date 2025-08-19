import * as THREE from "three";
import "./style.css";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader, DRACOLoader } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export const stats = new Stats();
document.body.appendChild(stats.dom);

export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

export const gui = new GUI();
export const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
};

size.resolution = new THREE.Vector2(size.width * size.pixelRatio, size.height * size.pixelRatio);

export const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);

export const scene = new THREE.Scene();


export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: size.pixelRatio < 2,
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
export const loadingManager = new THREE.LoadingManager();
export const gltfLoader = new GLTFLoader(loadingManager);
export const gltf = {
    loader: gltfLoader,
    useDraco: () => {
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        gltfLoader.setDRACOLoader(draco);
    }
};
export const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

export const rapierDebugRender = (scene) => {
    // 创建用于调试渲染的几何体和材质
    const debugGeometry = new THREE.BufferGeometry();
    const debugMaterial = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    const debugMesh = new THREE.LineSegments(debugGeometry, debugMaterial);
    scene.add(debugMesh);

    return (world) => {
        const { vertices, colors } = world.debugRender();
        debugGeometry.setAttribute('position',
            new THREE.BufferAttribute(vertices, 3));
        debugGeometry.setAttribute('color',
            new THREE.BufferAttribute(colors, 4));
    };
};
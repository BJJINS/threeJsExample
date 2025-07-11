import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, renderer, scene, cubeTextureLoader, gltfLoader, canvas, textureLoader } from "../template";
camera.position.set(4, 1, - 4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, canvas);


const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

const environmentMap = cubeTextureLoader.setPath(import.meta.resolve("./static/textures/environmentMaps/0/")).load([
    'px.jpg',
    'nx.jpg',
    'py.jpg',
    'ny.jpg',
    'pz.jpg',
    'nz.jpg'
]);
scene.background = environmentMap;
scene.environment = environmentMap;

const mapTexture = textureLoader.load(import.meta.resolve("./static/models/LeePerrySmith/color.jpg"));
mapTexture.colorSpace = THREE.SRGBColorSpace;
const normalTexture = textureLoader.load(import.meta.resolve("./static/models/LeePerrySmith/normal.jpg"));
// Material
const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    // 通过改变光线与模型表面的交互方式，法线贴图可以让模型看起来具有更多的细节.法线贴图依赖光照才能显示出效果，所以在场景中必须添加合适的光源，像方向光、点光源等。
    normalMap: normalTexture,
    onBeforeCompile: (shader) => {
        shader.vertexShader.replace(
            '#include <begin_vertex>',
             /*glsl*/ `
             #include <begin_vertex>
             transformed.y += 3.0;
            `
        );
    }
});




gltfLoader.load(
    import.meta.resolve("./static/models/LeePerrySmith/LeePerrySmith.glb"),
    (gltf) => {
        // Model
        const mesh = gltf.scene.children[0];
        mesh.rotation.y = Math.PI * 0.5;
        mesh.material = material;
        scene.add(mesh);

        // Update materials
        updateAllMaterials();
    }
);


const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, - 2.25);
scene.add(directionalLight);



function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
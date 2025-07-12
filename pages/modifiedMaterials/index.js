import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, cubeTextureLoader, gltfLoader, renderer, scene, textureLoader } from "../template";

renderer.shadowMap.enabled = true;

camera.position.set(4, 1, - 4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, canvas);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 20),
    new THREE.MeshStandardMaterial()
);
plane.rotation.y = Math.PI;
plane.position.y = - 5;
plane.position.z = 5;
plane.receiveShadow = true;
scene.add(plane);


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


const customUniforms = {
    uTime: { value: 0 }
};

// 模型发生和高度正相关的扭曲
// 但是这种扭曲不会影响到阴影
// 自己创建MeshDepthMaterial来显示阴影
const depthMaterial = new THREE.MeshDepthMaterial({
    // 用MeshDepthMaterial制造阴影，depthPacking必须是RGBADepthPacking
    depthPacking: THREE.RGBADepthPacking,
    onBeforeCompile: (shader) => {
        shader.uniforms = {
            ...shader.uniforms,
            ...customUniforms
        };
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotateMatrix * transformed.xz;
        `
    )
    }
});



// Material
const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    // 通过改变光线与模型表面的交互方式，法线贴图可以让模型看起来具有更多的细节.法线贴图依赖光照才能显示出效果，所以在场景中必须添加合适的光源，像方向光、点光源等。
    normalMap: normalTexture,
    onBeforeCompile: (shader) => {
        shader.uniforms = {
            ...shader.uniforms,
            ...customUniforms
        };
        shader.vertexShader = shader.vertexShader.replace("#include <common>", `
            #include <common>
            uniform float uTime;
            mat2 get2dRotateMatrix(float angle) {
                return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                }`);
        shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
            #include <beginnormal_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            transformed.xz = rotateMatrix * transformed.xz;
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
        mesh.customDepthMaterial = depthMaterial;
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


const clock = new THREE.Clock();
function render() {
    const elapsed = clock.getElapsedTime();
    customUniforms.uTime.value = elapsed;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
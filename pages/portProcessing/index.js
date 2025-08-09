import * as THREE from "three";
import { scene, camera, renderer, gui, gltf, textureLoader, size } from "../template";
import damagedHelmetPath from "./static/models/DamagedHelmet/glTF/DamagedHelmet.gltf?url";
import { DotScreenPass, EffectComposer, GlitchPass, OrbitControls, RenderPass } from "three/examples/jsm/Addons.js";

gltf.useDraco();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader
    .setPath(import.meta.resolve("./static/textures/environmentMaps/0/"))
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

scene.background = environmentMap;
scene.environment = environmentMap;
gltf.loader.load(damagedHelmetPath, (gltf) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);
    updateAllMaterials();
});

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = 2.5;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

camera.position.set(4, 1, -4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;

// 效果合成器 后期处理
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(size.width, size.height);
effectComposer.setPixelRatio(size.pixelRatio);
// 用来渲染原本的效果 等同于 renderer.render(scene, camera)
const renderPass = new RenderPass(scene, camera); 
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass)

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // renderer.render(scene, camera);
    effectComposer.render();
    window.requestAnimationFrame(tick);
};

tick();

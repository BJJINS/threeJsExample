import * as THREE from "three";
import { scene, camera, renderer, gui, gltf, textureLoader, size } from "../template";
import damagedHelmetPath from "./static/models/DamagedHelmet/glTF/DamagedHelmet.gltf?url";
import { DotScreenPass, EffectComposer, GammaCorrectionShader, GlitchPass, OrbitControls, RenderPass, RGBShiftShader, ShaderPass, SMAAPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"

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

const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {   // 采样数量，默认是0，采样数越大抗锯齿效果越好，性能越差
        // 如果用户的像素比高于1，像素密度已经足够高，以至于无法分辨锯齿。在这种情况下，实际上不需要抗锯齿
        // 兼容性有问题需要支持webgl2.0
        samples: size.pixelRatio === 1 ? 2 : 0
    }
);
// 效果合成器 后期处理
const effectComposer = new EffectComposer(renderer, renderTarget);
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
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
effectComposer.addPass(rgbShiftPass);
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

const unrealBloomPass= new UnrealBloomPass();
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
unrealBloomPass.enabled = false;
gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)
effectComposer.addPass(unrealBloomPass);

const tintPass = new ShaderPass({
    uniforms:{
        // 上一阶段获取纹理
        tDiffuse: { value: null }
    },
    vertexShader,
    fragmentShader
})

effectComposer.addPass(tintPass)


// 如果不支持webgl2.0，开启抗锯齿通道
if (size.pixelRatio === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);
}


window.addEventListener("resize", () => {
    effectComposer.setSize(size.width, size.height);
    effectComposer.setPixelRatio(size.pixelRatio);
});

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // renderer.render(scene, camera);
    effectComposer.render();
    window.requestAnimationFrame(tick);
};

tick();

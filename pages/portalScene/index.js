import * as THREE from 'three';
import { scene, camera, renderer, textureLoader, gltf, gui, stats, size } from "../template";
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

camera.far = 100;
camera.fov = 45;
camera.position.set(4, 2, 4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AxesHelper(4));

const debugObject = {
    clearColor: '#201919'
};
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(debugObject.clearColor);
    });

const bakedTexture = textureLoader.load(import.meta.resolve("./static/baked.jpg"));
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
const backedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
});
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
const portalLightMaterial = new THREE.ShaderMaterial({ 
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0)
    }
 });

gltf.loader.load(
    import.meta.resolve("./static/portal.glb"),
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                let material = backedMaterial;
                if (["Cube011", "Cube015"].includes(child.name)) {
                    material = poleLightMaterial;
                } else if ("Circle" === child.name) {
                    material = portalLightMaterial;
                }
                child.material = material;
            }
        });
        scene.add(gltf.scene);
    });

const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);
for (let i = 0; i < firefliesCount; i++) {
    const i3 = i * 3;
    positionArray[i3 + 0] = (Math.random() - 0.5) * 4;
    positionArray[i3 + 1] = Math.random() * 1.5;
    positionArray[i3 + 2] = (Math.random() - 0.5) * 4;

    scaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));
const firefliesMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    uniforms: {
        uPixelRatio: new THREE.Uniform(size.pixelRatio),
        uSize: new THREE.Uniform(200),
        uTime: new THREE.Uniform(0)
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});
scene.add(new THREE.Points(firefliesGeometry, firefliesMaterial));
gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize');



const clock = new THREE.Clock();

const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();
    firefliesMaterial.uniforms.uTime.value = elapsedTime;
    portalLightMaterial.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    stats.end();
    window.requestAnimationFrame(tick);
};

tick();
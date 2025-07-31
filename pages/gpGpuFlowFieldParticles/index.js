import * as THREE from 'three';
import { camera, renderer, gui, scene, size, gltf } from "../template";
import { GPUComputationRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import particlesVertexShader from "./particles/vertex.glsl";
import particlesFragmentShader from "./particles/frag.glsl";
import gpgpuShader from "./gpgpu.glsl";
import boatPath from "./static/model.glb?url";


camera.position.set(12.5, 8, 11);
camera.lookAt(0, 0, 0);
camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
scene.add(new THREE.AxesHelper(5));

const debugObject = {
    clearColor: '#201919'
};
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, 'clearColor').onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});

const obitControls = new OrbitControls(camera, renderer.domElement);
obitControls.enableDamping = true;

gltf.useDraco();
const { scene: { children: [boat] } } = await gltf.loader.loadAsync(boatPath);
const { color: boatColor, position: { array: boatPositionArray, count: boatPositionCount } } = boat.geometry.attributes;

const gpgpuSize = Math.ceil(Math.sqrt(boatPositionCount));
const gpgpuComputation = new GPUComputationRenderer(gpgpuSize, gpgpuSize, renderer);
const initParticlesTexture = gpgpuComputation.createTexture();
for (let y = 0; y < gpgpuSize; y++) {
    for (let x = 0; x < gpgpuSize; x++) {
        const i = y * gpgpuSize + x;
        const i4 = i * 4;
        const i3 = i * 3;
        initParticlesTexture.image.data[i4] = boatPositionArray[i3];
        initParticlesTexture.image.data[i4 + 1] = boatPositionArray[i3 + 1];
        initParticlesTexture.image.data[i4 + 2] = boatPositionArray[i3 + 2];
        initParticlesTexture.image.data[i4 + 3] = Math.random();
    }
}
const gpgpuParticles = gpgpuComputation.addVariable("uParticlesTexture", gpgpuShader, initParticlesTexture);
gpgpuParticles.material.uniforms.uTime = new THREE.Uniform(0);
gpgpuParticles.material.uniforms.uBase = new THREE.Uniform(initParticlesTexture);
gpgpuParticles.material.uniforms.uDeltaTime = new THREE.Uniform(0);
gpgpuParticles.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5);
gpgpuParticles.material.uniforms.uFlowFieldStrength = new THREE.Uniform(2)
gpgpuParticles.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)
gui.add(gpgpuParticles.material.uniforms.uFlowFieldInfluence, 'value').min(0).max(1).step(0.001).name('uFlowfieldInfluence');
gui.add(gpgpuParticles.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).step(0.001).name('uFlowfieldStrength')
gui.add(gpgpuParticles.material.uniforms.uFlowFieldFrequency, 'value').min(0).max(1).step(0.001).name('uFlowfieldFrequency')


gpgpuComputation.setVariableDependencies(gpgpuParticles, [gpgpuParticles]);
gpgpuComputation.init();

const particlesTextureUv = new Float32Array(boatPositionCount * 2);
for (let y = 0; y < gpgpuSize; y++) {
    for (let x = 0; x < gpgpuSize; x++) {
        const i = y * gpgpuSize + x;
        const i2 = i * 2;
        const uvX = (x + 0.5) / gpgpuSize;
        const uvY = (y + 0.5) / gpgpuSize;
        particlesTextureUv[i2] = uvX;
        particlesTextureUv[i2 + 1] = uvY;
    }
}

// particles
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("aParticlesTextureUv", new THREE.BufferAttribute(particlesTextureUv, 2));
geometry.setAttribute("aColor", boatColor);
geometry.setDrawRange(0, boatPositionCount);
const material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uSize: new THREE.Uniform(0.07),
        uResolution: new THREE.Uniform(size.resolution),
        uParticlesTexture: new THREE.Uniform()
    }
});
const points = new THREE.Points(geometry, material);
scene.add(points);

gui.add(material.uniforms.uSize, "value", 0.01, 0.1, 0.001).name("uSize");

let previousTime = 0;
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    gpgpuParticles.material.uniforms.uDeltaTime.value = deltaTime;
    gpgpuParticles.material.uniforms.uTime.value = elapsedTime;

    gpgpuComputation.compute();
    material.uniforms.uParticlesTexture.value = gpgpuComputation.getCurrentRenderTarget(gpgpuParticles).texture;

    obitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
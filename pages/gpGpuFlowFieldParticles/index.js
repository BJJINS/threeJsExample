import * as THREE from "three";
import { camera, renderer, scene, gltf, gui, size } from "../template";
import { GPUComputationRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl';

camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(4.5, 4, 11);
camera.lookAt(0, 0, 0);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
scene.add(new THREE.AxesHelper(5));

const debugObject = {};
debugObject.clearColor = '#29191f';
renderer.setClearColor(debugObject.clearColor);

gltf.useDraco();
gltf.loader.load(import.meta.resolve("./static/model.glb"), () => {

});


/**
 * Base geometry
 */
const geometry = new THREE.SphereGeometry(3);
const baseGeometry = {
    instance: geometry,
    count: geometry.attributes.position.count
};


// gpgpu
const gpgpu = {};
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer);
const baseParticlesTexture = gpgpu.computation.createTexture();
for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    baseParticlesTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0];
    baseParticlesTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1];
    baseParticlesTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2];
    baseParticlesTexture.image.data[i4 + 3] = 0;
}
gpgpu.particlesVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticlesTexture);
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable]);
gpgpu.computation.init();

// Debug
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
    })
);
gpgpu.debug.position.x = 3;
scene.add(gpgpu.debug);


/**
 * Particles
 */
const particles = {};
// Geometry
const particlesUvArray = new Float32Array(baseGeometry.count * 2);
for (let y = 0; y < gpgpu.size; y++) {
    for (let x = 0; x < gpgpu.size; x++) {
        const i = y * gpgpu.size + x;
        const i2 = i * 2;
        const uvX = (x + 0.5) / gpgpu.size;
        const uvY = (y + 0.5) / gpgpu.size;
        particlesUvArray[i2] = uvX;
        particlesUvArray[i2 + 1] = uvY;
    }
}

particles.geometry = new THREE.BufferGeometry();
particles.geometry.setDrawRange(0, baseGeometry.count);
particles.geometry.setAttribute("aParticlesUv", new THREE.BufferAttribute(particlesUvArray, 2));
// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:
    {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(size.resolution),
        uParticlesTexture: new THREE.Uniform(),
    }
});

// Points
particles.points = new THREE.Points(particles.geometry, particles.material);
scene.add(particles.points);

/**
 * Tweaks
 */
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor); });
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize');

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    gpgpu.computation.compute();
    particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;
    renderer.render(scene, camera);
    orbitControls.update();
    requestAnimationFrame(tick);
};

tick();
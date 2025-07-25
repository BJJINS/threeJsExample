import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gui } from "../template";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

renderer.toneMapping = THREE.ACESFilmicToneMapping;
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;


const parameters = {
    depthColor: '#ff4000',
    surfaceColor: '#151c37'
};

gui.addColor(parameters, 'depthColor').onChange(() => {
    material.uniforms.depthColor.value.set(parameters.depthColor);
});
gui.addColor(parameters, 'surfaceColor').onChange(() => {
    material.uniforms.surfaceColor.value.set(parameters.surfaceColor);
});

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
waterGeometry.deleteAttribute("normal");

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(parameters.depthColor) },
        uSurfaceColor: { value: new THREE.Color(parameters.surfaceColor) },
        uColorOffset: { value: 0.925 },
        uColorMultiplier: { value: 1 }
    }
});

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed');
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations');

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');



const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotateX(-Math.PI / 2);
scene.add(water);


const clock = new THREE.Clock();
function render() {
    const elapsedTime = clock.getElapsedTime();
    waterMaterial.uniforms.uTime.value = elapsedTime;

    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
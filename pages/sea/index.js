import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gui } from "../template";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
scene.add(new THREE.AxesHelper(5));

const parameters = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff'
};

gui.addColor(parameters, 'depthColor').onChange(() => {
    material.uniforms.depthColor.value.set(parameters.depthColor);
});
gui.addColor(parameters, 'surfaceColor').onChange(() => {
    material.uniforms.surfaceColor.value.set(parameters.surfaceColor);
});

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

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
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 }
    }
});


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
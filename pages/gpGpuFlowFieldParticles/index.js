import * as THREE from "three";
import { camera, renderer, scene, gltf, gui ,size} from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(4.5, 4, 11);
camera.lookAt(0, 0, 0);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
scene.add(new THREE.AxesHelper(5));

const debugObject = {}
debugObject.clearColor = '#29191f';
renderer.setClearColor(debugObject.clearColor);

gltf.useDraco();
gltf.loader.load(import.meta.resolve("./static/model.glb"), () => {

});


/**
 * Particles
 */
const particles = {};

// Geometry
particles.geometry = new THREE.SphereGeometry(3);
// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:
    {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(size.resolution)
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
    renderer.render(scene, camera);
    orbitControls.update();
    requestAnimationFrame(tick);
};

tick();
import * as THREE from "three";
import { camera, gui, renderer, scene, canvas } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

scene.add(new THREE.AxesHelper(5));
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const clock = new THREE.Clock();

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
    }
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

function render() {
    const elapsedTime = clock.getElapsedTime();
    earth.rotation.y = elapsedTime * 0.1;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
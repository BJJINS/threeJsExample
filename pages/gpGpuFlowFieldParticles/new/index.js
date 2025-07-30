import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { camera, renderer, scene } from "../../template";
import  "./particles";

camera.fov = 35;
camera.far = 100;
camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix();
scene.add(new THREE.AxesHelper(5));
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const tick = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
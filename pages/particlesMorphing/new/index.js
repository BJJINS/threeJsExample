import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, renderer, scene } from "../../template";
import  "./particles";


camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);
const orbitControl = new OrbitControls(camera,renderer.domElement);
orbitControl.enableDamping = true;
scene.add(new THREE.AxesHelper(5));

const tick = () => {
    orbitControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();
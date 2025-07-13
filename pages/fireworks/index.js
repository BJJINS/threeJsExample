import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, textureLoader } from "../template";

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


scene.add(new THREE.AxesHelper(2))

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
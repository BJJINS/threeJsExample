import * as THREE from 'three';
import { scene, camera, renderer, textureLoader, gltf } from "../template";
import { OrbitControls } from 'three/examples/jsm/Addons.js';


camera.far = 100;
camera.fov = 45;
camera.position.set(4, 2, 4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
);

scene.add(cube);


const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
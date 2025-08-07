import * as THREE from 'three';
import { scene, camera, renderer, gui } from "../template";
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import spruikSunrisePath from "./static/spruit_sunrise.hdr?url";
camera.position.set(-10, 6, -2);
camera.lookAt(0, 0, 0);
camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
new OrbitControls(camera, renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const rgbeLoader = new RGBELoader();
rgbeLoader.load(spruikSunrisePath, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.backgroundBlurriness = 0.5;
    scene.environment = environmentMap;
});

const placeholder = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 5),
    new THREE.MeshPhysicalMaterial()
);
scene.add(placeholder);
const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
scene.add(directionalLight);

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();


    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
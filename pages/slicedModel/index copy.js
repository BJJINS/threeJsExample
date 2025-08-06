import * as THREE from 'three';
import { scene, camera, renderer, gltf, gui } from "../template";
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import environmentPath from "./static/aerodynamics_workshop.hdr?url";

camera.position.set(-5, 5, 12);
camera.lookAt(0, 0, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

new OrbitControls(camera, renderer.domElement);
gltf.useDraco();

const rgbeLoader = new RGBELoader();
rgbeLoader.load(environmentPath, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    scene.backgroundBlurriness = 0.5;
});

// Geometry
const geometry = new THREE.IcosahedronGeometry(2.5, 5);

// Material
const material = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080'
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
);
plane.receiveShadow = true;
plane.position.x = - 4;
plane.position.y = - 3;
plane.position.z = - 4;
plane.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(plane);

const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;

scene.add(new THREE.CameraHelper(directionalLight.shadow.camera))
scene.add(directionalLight);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
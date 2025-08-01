import * as THREE from "three";
import { scene, renderer, camera, gui } from "../template";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import environmentMapPath from "./static/urban_alley_01_1k.hdr?url";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import wobbleVertexShader from "./shaders/wobble/vertex.glsl"
import fragmentShader from "./shaders/wobble/fragment.glsl"

camera.fov = 35;
camera.far = 100;
camera.position.set(13, - 3, - 5);
camera.updateProjectionMatrix();
camera.lookAt(0, 0, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const orbitCOntrols = new OrbitControls(camera, renderer.domElement);
orbitCOntrols.enableDamping = true;

const rgbeLoader = new RGBELoader();
rgbeLoader.load(environmentMapPath, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
});
const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: wobbleVertexShader,
    fragmentShader: fragmentShader,
    // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false,
});
gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);
gui.add(material, 'transmission', 0, 1, 0.001);
gui.add(material, 'ior', 0, 10, 0.001);
gui.add(material, 'thickness', 0, 10, 0.001);
gui.addColor(material, 'color');
// Geometry
const geometry = new THREE.IcosahedronGeometry(2.5, 50);

// Mesh
const wobble = new THREE.Mesh(geometry, material);
wobble.receiveShadow = true;
wobble.castShadow = true;
scene.add(wobble);
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
);
plane.receiveShadow = true;
plane.rotation.y = Math.PI;
plane.position.y = - 5;
plane.position.z = 5;
scene.add(plane);
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, - 2.25);
scene.add(directionalLight);
const tick = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
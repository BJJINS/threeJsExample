import * as THREE from "three";
import { scene, renderer, camera, gui, gltf } from "../template";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import environmentMapPath from "./static/urban_alley_01_1k.hdr?url";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import wobbleVertexShader from "./shaders/wobble/vertex.glsl";
import wobbleFragmentShader from "./shaders/wobble/fragment.glsl";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

const debugObject = {};
debugObject.colorA = '#0000ff';
debugObject.colorB = '#ff0000';


// Material
const uniforms = {
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.5),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrength: new THREE.Uniform(0.3),

    uWarpPositionFrequency: new THREE.Uniform(0.38),
    uWarpTimeFrequency: new THREE.Uniform(0.12),
    uWarpStrength: new THREE.Uniform(1.7),

    uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
    uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB))
};

const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: wobbleVertexShader,
    fragmentShader: wobbleFragmentShader,
    // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    uniforms
});

gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency');
gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency');
gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name('uStrength');
gui.add(uniforms.uWarpPositionFrequency, 'value', 0, 2, 0.001).name('uWarpPositionFrequency');
gui.add(uniforms.uWarpTimeFrequency, 'value', 0, 2, 0.001).name('uWarpTimeFrequency');
gui.add(uniforms.uWarpStrength, 'value', 0, 2, 0.001).name('uWarpStrength');

gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);
gui.add(material, 'transmission', 0, 1, 0.001);
gui.add(material, 'ior', 0, 10, 0.001);
gui.add(material, 'thickness', 0, 10, 0.001);
gui.addColor(debugObject, 'colorA').onChange(() => uniforms.uColorA.value.set(debugObject.colorA));
gui.addColor(debugObject, 'colorB').onChange(() => uniforms.uColorB.value.set(debugObject.colorB));
// Geometry
let geometry = new THREE.IcosahedronGeometry(2.5, 50);
geometry = mergeVertices(geometry);
geometry.computeTangents();

const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: wobbleVertexShader,
    depthPacking: THREE.RGBADepthPacking,
    uniforms
});

// Mesh
const wobble = new THREE.Mesh(geometry, material);
wobble.customDepthMaterial = depthMaterial;
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

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    uniforms.uTime.value = elapsedTime;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
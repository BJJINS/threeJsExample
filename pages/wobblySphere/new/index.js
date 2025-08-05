import * as THREE from 'three';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import { scene, camera, renderer, gui } from "../../template";
import environmentMapPath from "../static/urban_alley_01_1k.hdr?url";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

camera.fov = 35;
camera.far = 100;
camera.position.set(13, - 3, - 5);
camera.updateProjectionMatrix();
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const rgbeLoader = new RGBELoader();
rgbeLoader.load(environmentMapPath, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
});

const debugObject = {};
debugObject.colorA = '#0000ff';
debugObject.colorB = '#ff0000';

const uniforms = {
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.5),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrength: new THREE.Uniform(0.3),

    uWrapPositionFrequency: new THREE.Uniform(0.38),
    uWrapTimeFrequency: new THREE.Uniform(0.12),
    uWrapStrength: new THREE.Uniform(0.17),

    uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
    uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB))
};


const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader,
    fragmentShader,
    uniforms,


    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false
});

const deptMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshDepthMaterial,
    uniforms,
    vertexShader,
    fragmentShader,
    depthPacking: THREE.RGBADepthPacking
});

gui.add(uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("uTimeFrequency");
gui.add(uniforms.uPositionFrequency, "value", 0, 2, 0.001).name("uPositionFrequency");
gui.add(uniforms.uStrength, "value", 0, 2, 0.001).name("uStrength");

gui.add(uniforms.uWrapTimeFrequency, "value", 0, 2, 0.001).name("uWrapTimeFrequency");
gui.add(uniforms.uWrapPositionFrequency, "value", 0, 2, 0.001).name("uWrapPositionFrequency");
gui.add(uniforms.uWrapStrength, "value", 0, 2, 0.001).name("uWrapStrength");

gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);
gui.add(material, 'transmission', 0, 1, 0.001);
gui.add(material, 'ior', 0, 10, 0.001);
gui.add(material, 'thickness', 0, 10, 0.001);
gui.addColor(material, 'color');


let geometry = new THREE.IcosahedronGeometry(2.5, 50);
geometry = mergeVertices(geometry);
geometry.computeTangents();

const wobble = new THREE.Mesh(geometry, material);
wobble.customDepthMaterial = deptMaterial;
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
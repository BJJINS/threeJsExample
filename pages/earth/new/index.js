import * as THREE from "three";
import { camera, gui, renderer, scene, canvas, textureLoader } from "../../template";
import { Lensflare, LensflareElement, OrbitControls } from "three/examples/jsm/Addons.js";

import day from "../static/earth/day.jpg?url";
import night from "../static/earth/night.jpg?url";
import specularClouds from "../static/earth/specularClouds.jpg?url";

import earthVertexShader from "./earthVertex.glsl";
import earthFragmentShader from "./earthFragment.glsl";


const dayTexture = textureLoader.load(day);
const nightTexture = textureLoader.load(night);
const specularCloudsTexture = textureLoader.load(specularClouds);
dayTexture.colorSpace = THREE.SRGBColorSpace;
nightTexture.colorSpace = THREE.SRGBColorSpace;
dayTexture.anisotropy = 8;
nightTexture.anisotropy = 8;


const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.2),
    new THREE.MeshBasicMaterial()
)
scene.add(sun);


const sunSpherical = new THREE.Spherical(1, Math.PI / 2, 0);
const sunPosition = new THREE.Vector3();

const updateSun = () => { 
    sunPosition.setFromSpherical(sunSpherical);
    sun.position.copy(sunPosition.clone().multiplyScalar(5));
};

updateSun();

gui.add(sunSpherical, "phi")
    .min(0)
    .max(Math.PI)
    .onChange(updateSun);

gui.add(sunSpherical, "theta")
    .min(0)
    .max(Math.PI * 2)
    .onChange(updateSun);


scene.add(new THREE.AxesHelper(5));
// renderer.setClearColor('#ffffff');
camera.position.x = 4;
camera.position.y = 5;
camera.position.z = 4;
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earth = new THREE.Mesh(
    earthGeometry,
    new THREE.ShaderMaterial({
        vertexShader: earthVertexShader,
        fragmentShader: earthFragmentShader,
        uniforms: {
            uTime: new THREE.Uniform(0),
            uSunDirection: new THREE.Uniform(sunPosition),
            uDayTexture: new THREE.Uniform(dayTexture),
            uNightTexture: new THREE.Uniform(nightTexture),
            uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
        }
    })
);
scene.add(earth);

const clock = new THREE.Clock();
function render() {
    const elapsedTime = clock.getElapsedTime();
    earth.rotation.y = elapsedTime * 0.1;
    earth.material.uniforms.uTime.value = elapsedTime;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
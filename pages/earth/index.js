import * as THREE from "three";
import { camera, gui, renderer, scene, canvas, textureLoader } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";


const dayTexture = textureLoader.load(import.meta.resolve("./static/earth/day.jpg"));
dayTexture.colorSpace = THREE.SRGBColorSpace;
const nightTexture = textureLoader.load(import.meta.resolve("./static/earth/night.jpg"));
nightTexture.colorSpace = THREE.SRGBColorSpace;
const cloudTexture = textureLoader.load(import.meta.resolve("./static/earth/specularClouds.jpg"));
cloudTexture.anisotropy = dayTexture.anisotropy = nightTexture.anisotropy = 8;
renderer.setClearColor('#333333')
scene.add(new THREE.AxesHelper(5));
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
camera.lookAt(0, 0, 0);

const earthParameters = {
    atmosphereDayColor: "#00aaff",
    atmosphereTwilightColor: '#ff6600'
};

const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new THREE.Vector3();
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
);
scene.add(debugSun);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const clock = new THREE.Clock();

const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
});

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uDayTexture: new THREE.Uniform(dayTexture),
        uNightTexture: new THREE.Uniform(nightTexture),
        uCloudTexture: new THREE.Uniform(cloudTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const atmosphere = new THREE.Mesh(
    earthGeometry,
    atmosphereMaterial
);
atmosphere.scale.set(1.04, 1.04, 1.04);
scene.add(atmosphere);

const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical);
    debugSun.position
        .copy(sunDirection)
        .multiplyScalar(5);

    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

};

updateSun();

gui.add(sunSpherical, 'phi')
    .min(0)
    .max(Math.PI)
    .onChange(updateSun);

gui.add(sunSpherical, 'theta')
    .min(- Math.PI)
    .max(Math.PI)
    .onChange(updateSun);

gui.addColor(earthParameters, 'atmosphereDayColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor);
    });

gui.addColor(earthParameters, 'atmosphereTwilightColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor);
    });

gui.addColor(earthParameters, 'atmosphereDayColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor);
        atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor);
    });

gui.addColor(earthParameters, 'atmosphereTwilightColor')
    .onChange(() => {
        earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor);
        atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor);
    });

function render() {
    const elapsedTime = clock.getElapsedTime();
    earth.rotation.y = elapsedTime * 0.1;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
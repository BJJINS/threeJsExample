import * as THREE from "three";
import { camera, gui, renderer, scene, canvas, textureLoader } from "../template";
import { Lensflare, LensflareElement, OrbitControls } from "three/examples/jsm/Addons.js";
import earthVertexShader from "./vertex.glsl";
import earthFragmentShader from "./fragment.glsl";
import day from "./static/earth/day.jpg?url";
import night from "./static/earth/night.jpg?url";
import specularClouds from "./static/earth/specularClouds.jpg?url";
import atmosphereVertexShader from "./atmosphereVertex.glsl";
import atmosphereFragmentShader from "./atmosphereFragment.glsl";
import lensflare0 from "./static/lenses/lensflare0.png?url";
import lensflare1 from "./static/lenses/lensflare1.png?url";

const textureFlare0 = textureLoader.load(lensflare0);
const textureFlare1 = textureLoader.load(lensflare1);

const dayTexture = textureLoader.load(day);
const nightTexture = textureLoader.load(night);
const specularCloudsTexture = textureLoader.load(specularClouds);
dayTexture.colorSpace = THREE.SRGBColorSpace;
nightTexture.colorSpace = THREE.SRGBColorSpace;

dayTexture.anisotropy = 8;
nightTexture.anisotropy = 8;

renderer.setClearColor('#333333');
camera.position.x = 4;
camera.position.y = 5;
camera.position.z = 4;
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const clock = new THREE.Clock();

const earthParameters = {
    atmosphereDayColor: "#00aaff",
    atmosphereTwilightColor: '#ff6600'
};

// 大气层
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


// 太阳
const sunLight = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
sunLight.color.setHSL(0.08, 0.8, 0.5);
scene.add(sunLight);
const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement(textureFlare0, 128, 0, sunLight.color));
lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.1));
lensflare.addElement(new LensflareElement(textureFlare1, 70, 0.2));
lensflare.addElement(new LensflareElement(textureFlare1, 120, 0.3));
sunLight.add(lensflare);
const sunSpherical = new THREE.Spherical(1, Math.PI / 2, 0);
const sunDirection = new THREE.Vector3();
const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical);
    sunLight.position.copy(sunDirection.clone().multiplyScalar(5));
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
};
updateSun();

gui.add(sunSpherical, "phi")
    .min(0)
    .max(Math.PI)
    .step(0.1)
    .onChange(updateSun);

gui.add(sunSpherical, "theta")
    .min(0)
    .max(Math.PI * 2)
    .step(0.1)
    .onChange(updateSun);

// 地球
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earth = new THREE.Mesh(
    earthGeometry,
    new THREE.ShaderMaterial({
        vertexShader: earthVertexShader,
        fragmentShader: earthFragmentShader,
        uniforms: {
            uDayTexture: new THREE.Uniform(dayTexture),
            uNightTexture: new THREE.Uniform(nightTexture),
            uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
            uSunDirection: new THREE.Uniform(sunDirection),
            uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
            uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
        }
    })
);
scene.add(earth);

const atmosphere = new THREE.Mesh(
    earthGeometry,
    atmosphereMaterial
);
atmosphere.scale.set(1.04, 1.04, 1.04);
scene.add(atmosphere);

gui.addColor(earthParameters, "atmosphereDayColor")
    .onChange(() => {
        earth.material.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor);
    });

gui.addColor(earthParameters, "atmosphereTwilightColor")
    .onChange(() => {
        earth.material.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor);
    });

function render() {
    const elapsedTime = clock.getElapsedTime();
    earth.rotation.y = elapsedTime * 0.1;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
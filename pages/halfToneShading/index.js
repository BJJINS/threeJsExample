import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltf, gui, size as winSize } from "../template";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const rendererParameters = {};
rendererParameters.clearColor = '#26132f';

renderer.setClearColor(rendererParameters.clearColor);

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor);
    });


const materialParameters = {};
materialParameters.color = '#ff794d';
materialParameters.shadowColor = '#8e19b8';
materialParameters.lightColor = '#e5ffe0';
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        uResolution: new THREE.Uniform(winSize.resolution),
        uLightRepetitions: new THREE.Uniform(130),
        uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor))
    }
});

gui
    .addColor(materialParameters, 'color')
    .onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color);
    });


gui
    .add(material.uniforms.uLightRepetitions, 'value')
    .min(1)
    .max(300)
    .step(1)
    .name("repetitions");

gui
    .addColor(materialParameters, 'lightColor')
    .onChange(() => {
        material.uniforms.uLightColor.value.set(materialParameters.lightColor);
    });

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
);
torusKnot.position.x = 3;
scene.add(torusKnot);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
);
sphere.position.x = - 3;
scene.add(sphere);

let suzanne = null;
gltf.loader.load(
    "/models/suzanne.glb",
    (gltf) => {
        suzanne = gltf.scene;
        suzanne.traverse((child) => {
            if (child.isMesh)
                child.material = material;
        });
        scene.add(suzanne);
    }
);

const clock = new THREE.Clock();
function render() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate objects
    if (suzanne) {
        suzanne.rotation.x = - elapsedTime * 0.1;
        suzanne.rotation.y = elapsedTime * 0.2;
    }

    sphere.rotation.x = - elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.2;

    torusKnot.rotation.x = - elapsedTime * 0.1;
    torusKnot.rotation.y = elapsedTime * 0.2;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
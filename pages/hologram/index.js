import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, gui } from "../template";
import suzannePath from "@models/suzanne.glb?url";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


const rendererParameters = {};
rendererParameters.clearColor = '#1d1f2a';
renderer.setClearColor(rendererParameters.clearColor);

gui.addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor);
    });

const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:false,
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color("#00eeff"))
    },
    side:THREE.DoubleSide,
    blending: THREE.AdditiveBlending
});

gui.addColor(material.uniforms.uColor, 'value')

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
);
sphere.position.x = - 3;
scene.add(sphere);

let suzanne = null;
gltfLoader.load(
    suzannePath,
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
    material.uniforms.uTime.value = elapsedTime;

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
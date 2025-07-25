import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, gui } from "../template";
import shadingVertexShader from './shaders/vertex.glsl';
import shadingFragmentShader from './shaders/fragment.glsl';

camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

scene.add(new THREE.AxesHelper(5));


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Light helpers
 */
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
);
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1);
directionalLightHelper.material.side = THREE.DoubleSide;
directionalLightHelper.position.set(0, 0, 3);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
);
pointLightHelper.material.color.setRGB(1, 0.1, 0.1);
pointLightHelper.position.set(0, 2.5, 0);
scene.add(pointLightHelper);


const materialParameters = {
    color: "#fff"
};

const material = new THREE.ShaderMaterial({
    vertexShader: shadingVertexShader,
    fragmentShader: shadingFragmentShader,
    uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    }
});

gui
    .addColor(materialParameters, 'color')
    .onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color);
    });


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

// Suzanne
let suzanne = null;
gltfLoader.load(
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
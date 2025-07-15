import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, gui } from "../template";
import shadingVertexShader from './shaders/shading/vertex.glsl';
import shadingFragmentShader from './shaders/shading/fragment.glsl';

const axes = new THREE.AxesHelper();
scene.add(axes);

camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



const materialParameters = {};
materialParameters.color = '#ffffff';

const material = new THREE.ShaderMaterial({
    vertexShader: shadingVertexShader,
    fragmentShader: shadingFragmentShader,
    uniforms:
    {
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
    './suzanne.glb',
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
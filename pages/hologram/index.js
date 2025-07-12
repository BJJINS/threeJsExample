import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, gui } from "../template";

const axes = new THREE.AxesHelper(10);
scene.add(axes);

camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);


const controls = new OrbitControls(camera, canvas);
controls.target.y = 3;
controls.enableDamping = true;


const rendererParameters = {};
rendererParameters.clearColor = '#1d1f2a';
renderer.setClearColor(rendererParameters.clearColor);

gui.addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor);
    });

const material = new THREE.MeshBasicMaterial();

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
    import.meta.resolve("./static/suzanne.glb"),
    (gltf) => {
        suzanne = gltf.scene;
        suzanne.traverse((child) => {
            if (child.isMesh)
                child.material = material;
        });
        scene.add(suzanne);
    }
);


function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
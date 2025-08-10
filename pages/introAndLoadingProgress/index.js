import * as THREE from 'three';
import { scene, camera, renderer, gltf, stats } from "../template";
import flightHelmetPath from "./static/models/FlightHelmet/glTF/FlightHelmet.gltf?url";
import { OrbitControls } from 'three/examples/jsm/Addons.js';

camera.position.set(4, 1, - 4);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);


const cubeTextureLoader = new THREE.CubeTextureLoader();
const debugObject = {};
debugObject.envMapIntensity = 2.5;

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};
const environmentMap = cubeTextureLoader
    .setPath(import.meta.resolve("./static/textures/environmentMaps/0/"))
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

environmentMap.colorSpace = THREE.SRGBColorSpace;
scene.background = environmentMap;
scene.environment = environmentMap;

gltf.useDraco();
gltf.loader.load(
    flightHelmetPath,
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, - 4, 0);
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene);
        updateAllMaterials();
    }
);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, - 2.25);
scene.add(directionalLight);

renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const tick = () => {
    stats.begin();
    renderer.render(scene, camera);

    stats.end();
    window.requestAnimationFrame(tick);
};

tick();
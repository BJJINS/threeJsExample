import * as THREE from 'three';
import { scene, camera, renderer, gltf, gui } from "../template";
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import environmentPath from "./static/aerodynamics_workshop.hdr?url";
import gearsPath from "./static/gears.glb?url";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

camera.position.set(-5, 5, 12);
camera.lookAt(0, 0, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

new OrbitControls(camera, renderer.domElement);
gltf.useDraco();

const rgbeLoader = new RGBELoader();
rgbeLoader.load(environmentPath, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    scene.backgroundBlurriness = 0.5;
});

const uniforms = {
    uSliceStart: new THREE.Uniform(1.75),
    uSliceArc: new THREE.Uniform(1.25),
};

const patchMap = {
    csm_Slice: {
        '#include <colorspace_fragment>':
            `
            #include <colorspace_fragment>
            if(!gl_FrontFacing)
                gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
        `
    }
};


gui.add(uniforms.uSliceStart, 'value', - Math.PI, Math.PI, 0.001).name('uSliceStart');
gui.add(uniforms.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('uSliceArc');

const material = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080'
});

// Material
const slicedMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    uniforms,
    vertexShader,
    fragmentShader,
    patchMap,
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080',
    side: THREE.DoubleSide,
    
});

const slicedDeptMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshDepthMaterial,
    uniforms,
    vertexShader,
    fragmentShader,
    patchMap,
    depthPacking: THREE.RGBADepthPacking
});


let model = null;
gltf.loader.load(gearsPath, (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            if (child.name === 'outerHull') {
                child.material = slicedMaterial;
                child.customDepthMaterial = slicedDeptMaterial;
            } else {
                child.material = material;
            }
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(model);
});

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
);
plane.receiveShadow = true;
plane.position.x = - 4;
plane.position.y = - 3;
plane.position.z = - 4;
plane.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(plane);

const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;

scene.add(directionalLight);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    if (model) {

        model.rotation.y = elapsedTime * 0.1;
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
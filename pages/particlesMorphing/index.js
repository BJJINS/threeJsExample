import * as THREE from "three";
import { camera, renderer, scene, gui, size } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 16);
camera.lookAt(0.0);
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;
scene.add(new THREE.AxesHelper(5));


const debugObject = {
    clearColor: "#160920"
};
gui.addColor(debugObject, 'clearColor')
    .onChange(() => { renderer.setClearColor(debugObject.clearColor); });
renderer.setClearColor(debugObject.clearColor);

const geometry = new THREE.SphereGeometry(3);
geometry.setIndex(null);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
        u_size: new THREE.Uniform(0.4),
        u_resolution: new THREE.Uniform(size.resolution)
    }
});

const points = new THREE.Points(geometry, material);
scene.add(points);


const tick = () => {
    orbitControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
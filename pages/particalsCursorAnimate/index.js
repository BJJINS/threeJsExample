import * as THREE from "three";
import { camera, gui, renderer, scene, canvas, size } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import particlesVertexShader from "./particlesVertex.glsl";
import particlesFragmentShader from "./particlesFragment.glsl";


camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
scene.add(new THREE.AxesHelper(20));


const particlesGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uResolution: new THREE.Uniform(size.resolution),
    }
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
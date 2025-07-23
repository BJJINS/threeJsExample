import * as THREE from "three";
import { camera, renderer, scene, size ,gui} from "../../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
gui.hide();

camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
planeGeometry.setIndex(null);
planeGeometry.deleteAttribute("normal");
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        u_resolution: new THREE.Uniform(size.resolution)
    }
});
const plane = new THREE.Points(planeGeometry, material);
scene.add(plane);

const tick = () => {
    renderer.render(scene, camera);
    orbitControl.update();
    requestAnimationFrame(tick);
};

tick();
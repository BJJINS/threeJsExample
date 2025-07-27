import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, renderer, scene, gui } from "../template";
import "./particles";


camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;

const parameters = {
    clearColor: "#160920",
};
gui.addColor(parameters, "clearColor").onChange(() => {
    renderer.setClearColor(parameters.clearColor);
});
renderer.setClearColor(parameters.clearColor);

const tick = () => {
    orbitControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();
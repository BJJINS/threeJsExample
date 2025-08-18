import { OrbitControls } from "three/examples/jsm/Addons.js";
import { scene, renderer, camera, gui } from "../template";
import {
    AmbientLight,
    AxesHelper,
    MeshNormalMaterial,
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    Quaternion,
} from "three";

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);
scene.add(new AxesHelper());

const ambientLight = new AmbientLight();
ambientLight.intensity = 2;

import("@dimforge/rapier3d").then((RAPIER) => { 
    const gravity = { x: 0.0, y: 0, z: 0.0 };
    const world = new RAPIER.World(gravity);
    
 });

const tick = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();

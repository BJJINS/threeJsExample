import { OrbitControls } from "three/examples/jsm/Addons.js";
import { scene, renderer, camera } from "../template";
import { AmbientLight, AxesHelper, MeshNormalMaterial, BoxGeometry, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

import('@dimforge/rapier3d').then((RAPIER) => {
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    const floorBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Fixed);
    const floorBody = new RAPIER.RigidBody(floorBodyDesc);


});

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);
scene.add(new AxesHelper());

const ambientLight = new AmbientLight();
ambientLight.intensity = 2;

const floor = new Mesh(
    new PlaneGeometry(2, 2),
    new MeshStandardMaterial({ color: 0xdddddd })
);
floor.rotateX(-Math.PI / 2);

const sampleMesh = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshNormalMaterial()
);
sampleMesh.position.set(0, 4, 0)
scene.add(ambientLight, floor, sampleMesh);



const tick = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();

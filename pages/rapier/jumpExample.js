import { OrbitControls } from "three/examples/jsm/Addons.js";
import { scene, renderer, camera, rapierDebugRender } from "../template";
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
import * as THREE from "three";
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);

const ambientLight = new AmbientLight();
ambientLight.intensity = 2;


const floor = new Mesh(
    new PlaneGeometry(2, 2),
    new MeshStandardMaterial({ color: "red" }),
);
floor.rotateX(-Math.PI / 2);

const sampleMesh = new Mesh(new BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
    color: "green",
}));
sampleMesh.position.set(0, 4, 0);
scene.add(ambientLight, floor, sampleMesh);
import("@dimforge/rapier3d").then((RAPIER) => {
    const gravity = new RAPIER.Vector3(0, -9.81, 0);
    const world = new RAPIER.World(gravity);

    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const floorBody = new RAPIER.RigidBody(floorBodyDesc);
    const floorColliderDesc = new RAPIER.ColliderDesc(
        new RAPIER.Cuboid(1, 0, 1),
    );
    world.createCollider(floorColliderDesc, floorBody);

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(0, 4, 0);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    const rigidBodyCollider = world.createCollider(
        rigidBodyColliderDesc,
        rigidBody,
    );
    rigidBodyCollider.setRestitution(0);


    const updateDebugRender = rapierDebugRender(scene);

    const tick = () => {
        world.step();
        const rigidBodyPosition = rigidBody.translation();
        sampleMesh.position.set(
            rigidBodyPosition.x,
            rigidBodyPosition.y,
            rigidBodyPosition.z,
        );
        const rigidBodyRotation = rigidBody.rotation();
        sampleMesh.rotation.setFromQuaternion(
            new Quaternion(
                rigidBodyRotation.x,
                rigidBodyRotation.y,
                rigidBodyRotation.z,
                rigidBodyRotation.w,
            ),
        );
        updateDebugRender(world);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };

    tick();
});

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { scene, renderer, camera } from "../template";
import { AmbientLight, AxesHelper, MeshNormalMaterial, BoxGeometry, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion } from "three";
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
sampleMesh.position.set(0, 4, 0);
scene.add(ambientLight, floor, sampleMesh);
import('@dimforge/rapier3d').then((RAPIER) => {
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const floorBody = new RAPIER.RigidBody(floorBodyDesc);
    const floorColliderDesc = new RAPIER.ColliderDesc(new RAPIER.Cuboid(0.5, 0, 0.5));
    world.createCollider(floorColliderDesc, floorBody);

    const rigidBodyDesc =  RAPIER.RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(0, 4, 0);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody);
    rigidBodyCollider.setRestitution(1);


    const tick = () => {
        world.step();
        const rigidBodyPosition = rigidBody.translation();
        sampleMesh.position.set(
            rigidBodyPosition.x,
            rigidBodyPosition.y,
            rigidBodyPosition.z);
        const rigidBodyRotation = rigidBody.rotation();
        sampleMesh.rotation.setFromQuaternion(
            new Quaternion(rigidBodyRotation.x, rigidBodyRotation.y, rigidBodyRotation.z, rigidBodyRotation.w)
        );

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };

    tick();
});






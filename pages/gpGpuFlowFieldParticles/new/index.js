import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { camera, renderer, scene } from "../../template";
import "./particles";
import './particles';
import main from './particles';

camera.fov = 35;
camera.far = 100;
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix();
scene.add(new THREE.AxesHelper(5));
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;



let loop;
main().then(({ material, gpuComputationRender, particlesVariable }) => {
    const clock = new THREE.Clock();
    const tick = () => {


        const elapsedTime = clock.getElapsedTime();
        material.uniforms.u_time.value = elapsedTime;
        gpuComputationRender.compute();
        material.uniforms.u_particlesTexture.value = gpuComputationRender.getCurrentRenderTarget(particlesVariable).texture;

        orbitControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();
});


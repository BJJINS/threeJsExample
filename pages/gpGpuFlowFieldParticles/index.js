import * as THREE from 'three';
import { camera, scene, renderer, gui, gltf, size } from "../template";
import { GPUComputationRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import particlesVertexShader from "./particles/vertex.glsl";
import particlesFragmentShader from "./particles/frag.glsl";
import computeFragmentShader from "./gpgpu.glsl";
import boatPath from "./static/model.glb?url";
camera.position.set(10, 10, 10);
camera.fov = 35;
camera.far = 100;
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix();
const orbitCOntrols = new OrbitControls(camera, renderer.domElement);
orbitCOntrols.enableDamping = true;

gltf.useDraco();
gltf.loader.loadAsync(boatPath).then((gltf) => {
    const { position: { array, count }, color } = gltf.scene.children[0].geometry.attributes;
    const computationSize = Math.ceil(Math.sqrt(count));

    const computation = new GPUComputationRenderer(computationSize, computationSize, renderer);
    const particlesTexture = computation.createTexture();
    const particlesTextureUv = new Float32Array(count * 2);
    const randomParticleArray = new Float32Array(count);

    for (let y = 0; y < computationSize; y++) {
        for (let x = 0; x < computationSize; x++) {
            const i = y * computationSize + x;
            const i2 = i * 2;
            const i3 = i * 3;
            const i4 = i * 4;
            particlesTexture.image.data[i4] = array[i3];
            particlesTexture.image.data[i4 + 1] = array[i3 + 1];
            particlesTexture.image.data[i4 + 2] = array[i3 + 2];
            particlesTexture.image.data[i4 + 3] = Math.random();

            randomParticleArray[i] = Math.random();

            particlesTextureUv[i2] = (x + 0.5) / computationSize;
            particlesTextureUv[i2 + 1] = (y + 0.5) / computationSize;
        }
    }
    const particlesVariable = computation.addVariable("uParticles", computeFragmentShader, particlesTexture);
    particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
    particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
    particlesVariable.material.uniforms.uBase = new THREE.Uniform(particlesTexture);
    particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5);
    particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5);

    gui.add(particlesVariable.material.uniforms.uFlowFieldFrequency, "value", 0, 1, 0.01).name("uFlowFieldFrequency");
    gui.add(particlesVariable.material.uniforms.uFlowFieldInfluence, "value", 0, 1, 0.01).name("uFlowFieldInfluence");



    computation.setVariableDependencies(particlesVariable, [particlesVariable]);
    computation.init();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("aUv", new THREE.BufferAttribute(particlesTextureUv, 2));
    geometry.setAttribute("aColor", color);
    geometry.setAttribute("aRandomSize", new THREE.BufferAttribute(randomParticleArray, 1));
    geometry.setDrawRange(0, count);
    const material = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(0.07),
            uResolution: new THREE.Uniform(size.resolution),
            uParticlesTexture: new THREE.Uniform(),
        }
    });

    gui.add(material.uniforms.uSize, "value", 0.001, 0.5, 0.01).name("uSize");
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();
    let previewsTime = 0;
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previewsTime;
        previewsTime = elapsedTime;
        particlesVariable.material.uniforms.uDeltaTime.value = deltaTime;
        particlesVariable.material.uniforms.uTime.value = elapsedTime;
        computation.compute();
        material.uniforms.uParticlesTexture.value = computation.getCurrentRenderTarget(particlesVariable).texture;

        orbitCOntrols.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();
});


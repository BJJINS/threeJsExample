import * as THREE from 'three';

import { scene, gltf, size, renderer } from "../../template";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import useGUI from "./gui";
import boatPath from "../static/model.glb?url";
import initGpgpu from './gpgpu';

gltf.useDraco();
const main = async () => {
    const boatGltf = await gltf.loader.loadAsync(boatPath);
    const boat = boatGltf.scene.children[0];
    const { position, color } = boat.geometry.attributes;
    const { count, array } = position;

    const { gpuComputationRender, uv } = initGpgpu(renderer, array, count);

    const geometry = new THREE.SphereGeometry(3);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            u_size: new THREE.Uniform(0.2),
            u_resolution: new THREE.Uniform(size.resolution)
        }
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    useGUI(material);

    const tick = () => {
        gpuComputationRender.compute();
    };

    tick();

};


main();


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

    const { gpuComputationRender, uv, particlesVariable } = initGpgpu(renderer, array, count);

    const geometry = new THREE.BufferGeometry();
    geometry.setDrawRange(0, count);
    geometry.setAttribute('a_uv', new THREE.BufferAttribute(uv, 2));
    geometry.setAttribute("a_color", color);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
            u_size: new THREE.Uniform(0.07),
            u_resolution: new THREE.Uniform(size.resolution),
            u_particlesTexture: new THREE.Uniform(),
            u_time: new THREE.Uniform(0),
        }
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    useGUI(material);


    return {
        material,
        gpuComputationRender,
        particlesVariable
    }
};

export default main


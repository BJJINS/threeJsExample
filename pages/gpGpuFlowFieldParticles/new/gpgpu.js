import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js';
import gpgpuShader from "./gpgpu.glsl";

const initGpgpu = (renderer, positionsArray, count) => {
    const size = Math.ceil(Math.sqrt(count));
    const uv = new Float32Array(count * 2);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i2 = (y * size + x) * 2;
            uv[i2] = (x + 0.5) / size;
            uv[i2 + 1] = (y + 0.5) / size;
        }
    }
    const gpuComputationRender = new GPUComputationRenderer(size, size, renderer);
    const particlesTexture = gpuComputationRender.createTexture();
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;
        particlesTexture.image.data[i4] = positionsArray[i3];
        particlesTexture.image.data[i4 + 1] = positionsArray[i3 + 1];
        particlesTexture.image.data[i4 + 2] = positionsArray[i3 + 2];
        particlesTexture.image.data[i4 + 3] = 0;
    }
    const particlesVariable = gpuComputationRender.addVariable("u_particlesTexture", gpgpuShader, particlesTexture);
    gpuComputationRender.setVariableDependencies(particlesVariable, [particlesVariable]);
    gpuComputationRender.init();
    return {
        gpuComputationRender,
        particlesTexture,
        particlesVariable,
        uv
    };
};

export default initGpgpu;
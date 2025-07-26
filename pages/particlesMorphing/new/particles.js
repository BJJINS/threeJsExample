import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { size, gui, gltf, scene } from "../../template";
import parameters from "./guiParameters";

gltf.useDraco();
gltf.loader.load(
    import.meta.resolve("../static/models.glb"),
    (gltf) => {
        const newPositionArray = [];
        let maxCount = 0;
        const positionArray = gltf.scene.children.map((child) => {
            const { position: { array, count } } = child.geometry.attributes;
            maxCount = Math.max(maxCount, count);
            return array;
        });
        console.log('positionArray :>> ', positionArray);

        for (const position of positionArray) {
            const newPosition = new Float32Array(maxCount * 3);
            for (let i = 0; i < maxCount; i++) {
                
                
            }
        }
    }
);


const geometry = new THREE.SphereGeometry(3);
geometry.setIndex(null);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
        u_resolution: new THREE.Uniform(size.resolution),
        u_size: new THREE.Uniform(parameters.size)
    }
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

//  Gui
gui.add(parameters, "size")
    .min(0.2)
    .max(0.4)
    .step(0.01)
    .onFinishChange(() => {
        material.uniforms.u_size.value = parameters.size;
    });

export default particles;
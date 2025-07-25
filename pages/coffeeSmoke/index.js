import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { camera, canvas, renderer, scene, gltfLoader, textureLoader } from "../template";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

camera.position.x = 8;
camera.position.y = 10;
camera.position.z = 12;
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3;
controls.enableDamping = true;


gltfLoader.load(
    import.meta.resolve("./static/bakedModel.glb"),
    (gltf) => {
        // 最大支持的各向异性值
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        // 通常为2、4、8、16或更高
        // anisotropy 用于增强纹理在倾斜角度下显示效果的属性，是2的倍数，值越高，效果越好，但性能开销也越大
        gltf.scene.getObjectByName('baked').material.map.anisotropy = maxAnisotropy;
        scene.add(gltf.scene);
    }
);

const perlinTexture = textureLoader.load(import.meta.resolve("./static/perlin.png"));
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;


const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(1.5, 6, 1.5);
const smokeMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture)
    }
});
const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y += 1.83;
scene.add(smoke);


const clock = new THREE.Clock();
function render() {
    const elapsed = clock.getElapsedTime();
    smokeMaterial.uniforms.uTime.value = elapsed;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
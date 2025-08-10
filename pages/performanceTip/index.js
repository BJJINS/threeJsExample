import * as THREE from 'three';
import { scene, renderer, camera, textureLoader, stats } from "../template";
import displacementMapPath from "./static/textures/displacementMap.png";
import { BufferGeometryUtils, OrbitControls } from 'three/examples/jsm/Addons.js';

camera.position.set(2, 2, 6);
camera.lookAt(0, 0, 0);
new OrbitControls(camera, renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const displacementTexture = textureLoader.load(displacementMapPath);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(- 5, 0, 0);
scene.add(cube);

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
);
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
scene.add(torusKnot);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
);
sphere.position.set(5, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
);
floor.position.set(0, - 2, 0);
floor.rotation.x = - Math.PI * 0.5;
floor.castShadow = true;
floor.receiveShadow = true;
scene.add(floor);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);
const clock = new THREE.Clock();
const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    stats.end();
    window.requestAnimationFrame(tick);
};

tick();

// Tip 1
console.log(renderer.info);

// Tip 2
// 删除物体 注意内存泄漏
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// Tip 3
// 尽量不要使用灯光，如果需要使用灯光，尽量使用平行光、环境光和半球光
// 在场景中添加或移除灯光时，所有支持灯光的材质都必须重新编译。这就是Three.js的工作方式，如果有一个复杂的场景，这可能会使屏幕冻结片刻。
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// Tip 4
// 与灯光一样，阴影很实用，但会影响性能。应避免使用阴影，并尝试寻找替代方案，如烘焙阴影，例如将阴影直接绘制在纹理中。
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// Tip 5
// 目前，阴影贴图在每次渲染前都会更新。可以停用此自动更新，并在必要时才通知Three.js阴影贴图需要更新
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// Tip 6
// 共享几何图形
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()
// for(let i = 0; i < 50; i++)
// {
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2
//     scene.add(mesh)
// }

// Tip 20
// 合并几何图形
// const geometries = []
// for(let i = 0; i < 50; i++){
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
//     geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
//     geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)
//     geometry.translate(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )
//     geometries.push(geometry)
// }

// const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries)
// const material = new THREE.MeshNormalMaterial()

// const mesh = new THREE.Mesh(mergedGeometry, material)
// scene.add(mesh)

// Tip 22
// 无法合并几何体，因为你需要独立控制网格，但它们使用相同的几何体和相同的材质，那么你可以使用
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.InstancedMesh(geometry, material, 50);
// scene.add(mesh);
// for (let i = 0; i < 50; i++) {
//     const position = new THREE.Vector3(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     );

//     const quaternion = new THREE.Quaternion();
//     quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0));

//     const matrix = new THREE.Matrix4();
//     matrix.makeRotationFromQuaternion(quaternion);
//     matrix.setPosition(position);

//     mesh.setMatrixAt(i, matrix);
// }


const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uDisplacementTexture: { value: displacementTexture },
        uDisplacementStrength: { value: 1.5 }
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        uniform float uDisplacementStrength;

        varying vec2 vUv;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            if(elevation < 0.5)
            {
                elevation = 0.5;
            }

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()
        {
            float elevation = texture2D(uDisplacementTexture, vUv).r;
            if(elevation < 0.25)
            {
                elevation = 0.25;
            }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = vec3(0.0);
            finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)
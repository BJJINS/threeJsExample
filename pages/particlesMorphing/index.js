import * as THREE from "three";
import { camera, renderer, scene, gui, size, gltfLoader, useDraco } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import model from "./static/models.glb?url";

scene.add(new THREE.AxesHelper(4));
gltfLoader.useDraco();
gltfLoader.loader.load(model, (gltf) => {
    let maxCount = 0;
    const newPositions = [];
    let currentIndex = 0;
    const colorA = '#ff7300';
    const colorB = '#0091ff';


    const positions = gltf.scene.children.map((child) => {
        const { position } = child.geometry.attributes;
        const { count } = position;
        maxCount = Math.max(count, maxCount);
        return position;
    });

    for (const position of positions) {
        const originalArray = position.array;
        const newArray = new Float32Array(maxCount * 3);
        for (let i = 0; i < maxCount; i++) {
            const i3 = i * 3;
            if (i3 < originalArray.length) {
                newArray[i3] = originalArray[i3];
                newArray[i3 + 1] = originalArray[i3 + 1];
                newArray[i3 + 2] = originalArray[i3 + 2];
            } else {
                const randomIndex = Math.floor(Math.random() * position.count) * 3;
                newArray[i3] = originalArray[randomIndex];
                newArray[i3 + 1] = originalArray[randomIndex + 1];
                newArray[i3 + 2] = originalArray[randomIndex + 2];
            }
        }
        newPositions.push(new THREE.Float32BufferAttribute(newArray, 3));
    }

    const sizesArray = new Float32Array(maxCount);
    for (let i = 0; i < maxCount; i++)
        sizesArray[i] = Math.random();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", newPositions[currentIndex]);
    geometry.setAttribute("a_positionTarget", newPositions[1]);
    geometry.setAttribute('a_size', new THREE.BufferAttribute(sizesArray, 1));
    geometry.setIndex(null);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            u_size: new THREE.Uniform(0.4),
            u_resolution: new THREE.Uniform(size.resolution),
            u_progress: new THREE.Uniform(0),
            u_colorA: new THREE.Uniform(new THREE.Color(colorA)),
            u_colorB: new THREE.Uniform(new THREE.Color(colorB))
        }
    });

    const aPoints = new THREE.Points(geometry, material)
    scene.add(aPoints)
    console.log(aPoints.geometry.boundingSphere)



    const morph = (index) => {
        geometry.setAttribute("position", newPositions[currentIndex]);
        geometry.setAttribute("a_positionTarget", newPositions[index]);
        gsap.fromTo(material.uniforms.u_progress,
            { value: 0 },
            {
                value: 1,
                duration: 3,
                ease: "power1.out",
            });
        currentIndex = index;
    };


    const morphFnMap = {
        morph0: () => { morph(0); },
        morph1: () => { morph(1); },
        morph2: () => { morph(2); },
        morph3: () => { morph(3); },
    };

    gui.add(morphFnMap, 'morph0');
    gui.add(morphFnMap, 'morph1');
    gui.add(morphFnMap, 'morph2');
    gui.add(morphFnMap, 'morph3');

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    gui.add(material.uniforms.u_progress, "value", 0, 1, 0.01).name("u_progress").listen();

});


camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 16);
camera.lookAt(0.0);
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;


const debugObject = {
    clearColor: "#160920"
};
gui.addColor(debugObject, 'clearColor')
    .onChange(() => { renderer.setClearColor(debugObject.clearColor); });
renderer.setClearColor(debugObject.clearColor);




const tick = () => {
    orbitControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
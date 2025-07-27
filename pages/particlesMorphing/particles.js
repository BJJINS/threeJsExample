import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { size, gui, gltf, scene } from "../template";
import gsap from "gsap";

gltf.useDraco();
gltf.loader.load(
    // models.glb attributes的position数组是删除了公用的顶点，使用了index
    // 测试在blender中对模型使用平滑着色再用threeJs导入就会删除这些公用的顶点
    // 如果没有使用平滑着色那么position中包含所有顶点
    import.meta.resolve("./static/models.glb"),
    (gltf) => {
        const attrBufferPositionArr = [];
        let maxCount = 0;
        let randomSizeArr;
        let currentIndex = 0;
        const colorA = '#ff7300';
        const colorB = '#0091ff';
        const positionArray = gltf.scene.children.map((child) => {
            const { position: { array, count } } = child.geometry.attributes;
            maxCount = Math.max(maxCount, count);
            return array;
        });
        randomSizeArr = new Float32Array(maxCount);

        for (let i = 0; i < maxCount; i++) {
            randomSizeArr[i] = Math.random();
        }

        positionArray.forEach((position) => {
            const newPositionArr = new Float32Array(maxCount * 3);
            for (let i = 0; i < maxCount; i++) {
                const i3 = i * 3;
                if (i3 < position.length) {
                    newPositionArr[i3] = position[i3];
                    newPositionArr[i3 + 1] = position[i3 + 1];
                    newPositionArr[i3 + 2] = position[i3 + 2];
                } else {
                    const randomIndex = Math.floor(Math.random() * position.length / 3) * 3;
                    newPositionArr[i3] = position[randomIndex];
                    newPositionArr[i3 + 1] = position[randomIndex + 1];
                    newPositionArr[i3 + 2] = position[randomIndex + 2];
                }
            }
            attrBufferPositionArr.push(new THREE.Float32BufferAttribute(newPositionArr, 3));
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", attrBufferPositionArr[currentIndex]);
        geometry.setAttribute("a_targetPosition", attrBufferPositionArr[3]);
        geometry.setAttribute("a_size", new THREE.BufferAttribute(randomSizeArr, 1));
        geometry.setIndex(null);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                u_resolution: new THREE.Uniform(size.resolution),
                u_size: new THREE.Uniform(0.4),
                u_progress: new THREE.Uniform(0),
                u_colorA: new THREE.Uniform(new THREE.Color(colorA)),
                u_colorB: new THREE.Uniform(new THREE.Color(colorB))
            }
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const morph = (index) => {
            geometry.setAttribute("position", attrBufferPositionArr[currentIndex]);
            geometry.setAttribute("a_targetPosition", attrBufferPositionArr[index]);
            gsap.fromTo(material.uniforms.u_progress,
                { value: 0 },
                {
                    value: 1,
                    duration: 3,
                    ease: "power1.out",
                });
            currentIndex = index;
        };



        gui.add(material.uniforms.u_size, "value", 0.2, 0.8, 0.01);
        gui.add(material.uniforms.u_progress, "value", 0, 1, 0.01).name("progress").listen();

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
    }
);

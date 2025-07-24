import * as THREE from "three";
import { camera, renderer, scene, size, gui, textureLoader } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import picture from "./static/picture-4.png?url";
gui.hide();

const pictureTexture = textureLoader.load(picture);
camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;
scene.add(new THREE.AxesHelper(5));


// 用来和raycast进行碰撞检测
const interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide
    })
);
interactivePlane.visible = false;
scene.add(interactivePlane);


const raycaster = new THREE.Raycaster();
const cursor = new THREE.Vector2(9999, 9999);
window.addEventListener("pointermove", (event) => {
    cursor.x = (event.clientX / size.width) * 2 - 1;
    cursor.y = -(event.clientY / size.height) * 2 + 1;
});

const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.height = "256px";
canvas.style.width = "256px";
canvas.width = 128;
canvas.height = 128;
const context = canvas.getContext("2d");
context.globalCompositeOperation = "lighter";
context.fillRect(0, 0, canvas.width, canvas.height);
document.body.appendChild(canvas);
const glow = new Image();
glow.src = import.meta.resolve("./static/glow.png");
const glowSize = canvas.width * 0.25;
const canvasCursor = new THREE.Vector2(9999, 9999);
const canvasCursorPrevious = new THREE.Vector2(9999, 9999);
const displacementTexture = new THREE.CanvasTexture(canvas);


// 粒子人像
const planeGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
planeGeometry.setIndex(null);
planeGeometry.deleteAttribute("normal");
const intensitiesArray = new Float32Array(planeGeometry.attributes.position.count);
const anglesArray = new Float32Array(planeGeometry.attributes.position.count);
for (let i = 0; i < planeGeometry.attributes.position.count; i++) {
    intensitiesArray[i] = Math.random();
    anglesArray[i] = Math.random() * 2 * Math.PI;
}
planeGeometry.setAttribute("a_intensity", new THREE.BufferAttribute(intensitiesArray, 1));
planeGeometry.setAttribute("a_angle", new THREE.BufferAttribute(anglesArray, 1));
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        u_resolution: new THREE.Uniform(size.resolution),
        u_pictureTexture: new THREE.Uniform(pictureTexture),
        u_displacementTexture: new THREE.Uniform(displacementTexture),
    }
});
const plane = new THREE.Points(planeGeometry, material);
scene.add(plane);

const tick = () => {
    raycaster.setFromCamera(cursor, camera);
    const interactions = raycaster.intersectObject(interactivePlane);
    if (interactions.length) {
        const uv = interactions[0].uv;
        canvasCursor.x = uv.x * canvas.width;
        canvasCursor.y = (1 - uv.y) * canvas.height;
    } else {
        canvasCursor.set(9999, 9999);
    }

    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.02;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "lighter";
    const cursorDistance = canvasCursorPrevious.distanceTo(canvasCursor);
    const alpha = Math.min(cursorDistance * 0.1, 1);
    context.globalAlpha = alpha;
    context.drawImage(glow, canvasCursor.x - glowSize / 2, canvasCursor.y - glowSize / 2, glowSize, glowSize);
    displacementTexture.needsUpdate = true;
    renderer.render(scene, camera);
    orbitControl.update();
    requestAnimationFrame(tick);
};

tick();
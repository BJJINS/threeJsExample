import * as THREE from "three";
import { camera, renderer, scene, canvas, size, textureLoader } from "../template";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import particlesVertexShader from "./particlesVertex.glsl";
import particlesFragmentShader from "./particlesFragment.glsl";
import dog from "./static/picture-1.png?url";
import displacement from "./displacement";

const dogTexture = textureLoader.load(dog);
camera.fov = 35;
camera.far = 100;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(displacement.interactivePlane);

const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uResolution: new THREE.Uniform(size.resolution),
        uPictureTexture: new THREE.Uniform(dogTexture),
    }
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);



const rayCaster = new THREE.Raycaster();
const screenCursor = new THREE.Vector2(9999, 9999);
const canvasCursor = new THREE.Vector2(999, 999);
window.addEventListener("pointermove", (e) => {
    screenCursor.x = (e.clientX / size.width) * 2 - 1;
    screenCursor.y = 1 - (e.clientY / size.height) * 2;
});

function render() {
    controls.update();

    rayCaster.setFromCamera(screenCursor, camera);
    const intersections = rayCaster.intersectObject(displacement.interactivePlane);
    if (intersections.length) {
        const uv = intersections[0].uv;
        canvasCursor.x = uv.x * displacement.canvas.width;
        canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
    }
    displacement.context.clearRect(0, 0, displacement.canvas.width, displacement.canvas.height);
    displacement.context.drawImage(
        displacement.image,
        canvasCursor.x,
        canvasCursor.y,
        32,
        32
    );

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
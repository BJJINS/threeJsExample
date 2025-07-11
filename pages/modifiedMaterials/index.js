import { camera, renderer, scene } from "../template";

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
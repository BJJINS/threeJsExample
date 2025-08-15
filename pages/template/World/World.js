import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

class World {
    constructor(container) {
        const camera = createCamera();
        const scene = createScene();
        const renderer = createRenderer();
        container.append(renderer.domElement);

        const cube = createCube();

        scene.add(cube);
        const resizer = new Resizer(container, camera, renderer);

        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export { World };
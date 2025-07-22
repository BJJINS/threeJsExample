import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import glow from "./static/glow.png?url";
const canvas = document.createElement("canvas");
canvas.style.position = 'fixed';
canvas.style.width = '512px';
canvas.style.height = '512px';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 2;
canvas.width = canvas.height = 128;
const context = canvas.getContext("2d");
const image = new Image();
image.src = glow;
context.fillRect(0, 0, canvas.width, canvas.height);
document.body.appendChild(canvas);


const interactivePlane = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshBasicMaterial({
        color: "red"
    })
);


export default {
    context,
    interactivePlane,
    image,
    canvas
}


import { gui, renderer } from "../../template";

const parameters = {
    clearColor: "#160920",
    size: 0.4
};

gui.addColor(parameters, "clearColor").onChange(() => {
    renderer.setClearColor(parameters.clearColor);
});
renderer.setClearColor(parameters.clearColor);

export default parameters;
import { gui } from "../../template";
/**
 * @param {THREE.ShaderMaterial} material 
 */
const useGUI = (material) => {
    gui.add(material.uniforms.u_size, "value", 0.1, 0.8, 0.01);
};

export default useGUI;
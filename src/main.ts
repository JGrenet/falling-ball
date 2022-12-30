import Floor from "./obj/Floor";
import Scene from "./obj/Scene";
import "./style.css";

const scene = new Scene();

// Floor
new Floor(scene);

scene.render();

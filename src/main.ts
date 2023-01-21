import Ball from "./obj/SceneObjects/Ball";
import Floor from "./obj/SceneObjects/Floor";
import Plank from "./obj/SceneObjects/Plank";
import Scene from "./obj/Scene";
import World from "./obj/World";
import "./style.css";

const world = new World();

const scene = new Scene(true, world);

// Floor
const floor = new Floor(scene, world);

// Plank
const plank = new Plank(scene, world);

// Ball
const ball = new Ball(scene, world);

scene.render([ball, floor, plank]);

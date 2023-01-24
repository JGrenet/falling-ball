import Ball from "./obj/SceneObjects/Ball";
import Floor from "./obj/SceneObjects/Floor";
import Plank from "./obj/SceneObjects/Plank";
import Scene from "./obj/Scene";
import World from "./obj/World";
import * as dat from "lil-gui";
import "./style.css";

const gui = new dat.GUI();

const world = new World();

const scene = new Scene(true, world, gui);

// Floor
const floor = new Floor(scene, world);

// Plank (When the plank move left by 3, it moves top by 1.2)
const plank1 = new Plank(scene, world, { x: -10, y: 0, z: 0 });
const plank2 = new Plank(scene, world, { x: -7, y: 1.2, z: 0 });
const plank3 = new Plank(scene, world, { x: -4, y: 2.4, z: 0 });
const plank4 = new Plank(scene, world, { x: -1, y: 3.6, z: 0 });
const plank5 = new Plank(scene, world, { x: 2, y: 4.8, z: 0 });
const plank6 = new Plank(scene, world, { x: 5, y: 6, z: 0 });
const plank7 = new Plank(scene, world, { x: 8, y: 7.2, z: 0 });

// // Ball
const ball = new Ball(scene, world);

scene.render([
    floor,
    ball,
    plank1,
    plank2,
    plank3,
    plank4,
    plank5,
    plank6,
    plank7
]);

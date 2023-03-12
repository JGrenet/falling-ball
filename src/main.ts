import Ball from "./obj/SceneObjects/Ball";
import Floor from "./obj/SceneObjects/Floor";
import Plank from "./obj/SceneObjects/Plank";
import Scene from "./obj/Scene";
import World from "./obj/World";
import * as dat from "lil-gui";
import "./style.css";
import SpotLight from "./obj/SceneObjects/SpotLight";

export const INITIAL_X = -10;
export const INITIAL_Y = 0;
export const NB_PLANKS = 14;

const gui = new dat.GUI();

const world = new World();

const scene = new Scene(false, world, gui);

// Floor
const floor = new Floor(scene, world);

const planks = [];

for (let i = 0; i < NB_PLANKS; i++) {
    const x = INITIAL_X + i * 3;
    const y = INITIAL_Y + i * 1.2;

    planks.push(new Plank(scene, world, { x, y, z: 0 }));
}

// Ball
const ball = new Ball(scene, world);

// Lights (Spotlight)
new SpotLight(scene);

scene.render([floor, ball, ...planks], ball);

ball.push();

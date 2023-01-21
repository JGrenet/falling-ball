import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import SceneObject from "./SceneObject";
import World from "../World";
import { Body, Box, Vec3 } from "cannon-es";

const PLANK_HEIGHT = 0.5;
const PLANK_WIDTH = 3;
const PLANK_DEPTH = 3;

export default class Plank implements SceneObject {
    physicInstance: Body;
    instance: Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        const position = {
            x: 0,
            y: PLANK_HEIGHT / 2,
            z: 0
        };

        // Create a box in CANNON world
        const boxShape = new Box(
            new Vec3(PLANK_WIDTH / 2, PLANK_HEIGHT / 2, PLANK_DEPTH / 2)
        );
        this.physicInstance = new Body({
            mass: 0,
            shape: boxShape,
            position: new Vec3(position.x, position.y, position.z),
            type: Body.STATIC
        });

        this.world.instance.addBody(this.physicInstance);

        // Create a sphere in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.BoxGeometry(PLANK_WIDTH, PLANK_HEIGHT, PLANK_DEPTH),
            new THREE.MeshStandardMaterial({ color: "#8B4513" })
        );

        this.instance.position.set(position.x, position.y, position.z);
        scene.threeScene.add(this.instance);
    }

    onRender(): void {
        this.instance.position.copy(
            this.physicInstance.position as unknown as THREE.Vector3
        );
    }
}

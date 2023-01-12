import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import * as CANNON from "cannon";
import SceneObject from "./SceneObject";
import World from "../World";

const PLANK_HEIGHT = 0.5;
const PLANK_WIDTH = 3;
const PLANK_DEPTH = 3;

export default class Plank implements SceneObject {
    physicInstance: CANNON.Body;
    instance: Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        const position = {
            x: 0,
            y: PLANK_HEIGHT / 2,
            z: 0
        };

        // Create a box in CANNON world
        const boxShape = new CANNON.Box(
            new CANNON.Vec3(PLANK_WIDTH, PLANK_HEIGHT, PLANK_DEPTH)
        );
        this.physicInstance = new CANNON.Body({
            mass: 1,
            shape: boxShape,
            position: new CANNON.Vec3(position.x, position.y, position.z)
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

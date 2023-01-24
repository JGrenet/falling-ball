import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import SceneObject from "./SceneObject";
import World from "../World";
import { Body, Box, Vec3 } from "cannon-es";

type PlankPosition = {
    x: number;
    y: number;
    z: number;
};

const PLANK_HEIGHT = 0.5;
const PLANK_WIDTH = 3;
const PLANK_DEPTH = 3;

export default class Plank implements SceneObject {
    physicInstance: Body;
    instance: Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    initialPosition: PlankPosition;

    constructor(
        private scene: Scene,
        private world: World,
        position: PlankPosition
    ) {
        // By default, the position of the box is at the center of the box so we need to add half of the height to the y position
        this.initialPosition = {
            ...position,
            y: position.y + PLANK_HEIGHT / 2
        };

        // Create a box in CANNON world
        const boxShape = new Box(
            new Vec3(PLANK_WIDTH / 2, PLANK_HEIGHT / 2, PLANK_DEPTH / 2)
        );
        this.physicInstance = new Body({
            mass: 0,
            shape: boxShape,
            position: new Vec3(
                this.initialPosition.x,
                this.initialPosition.y,
                this.initialPosition.z
            ),
            type: Body.STATIC
        });

        this.world.instance.addBody(this.physicInstance);

        // Create a sphere in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.BoxGeometry(PLANK_WIDTH, PLANK_HEIGHT, PLANK_DEPTH),
            new THREE.MeshStandardMaterial({ color: "#8B4513" })
        );

        this.instance.position.set(
            this.initialPosition.x,
            this.initialPosition.y,
            this.initialPosition.z
        );
        this.scene.threeScene.add(this.instance);
    }

    onRender(): void {
        // Updating the position of the box in the CANNON world
        this.physicInstance.position.set(
            this.instance.position.x + 0.025,
            this.instance.position.y + 0.01,
            this.instance.position.z
        );

        // When the box is out of the scene, we move it back to the beginning
        if (this.physicInstance.position.x > 10 + 1.2) {
            this.physicInstance.position.set(-10, 0 + PLANK_HEIGHT / 2, 0);
        }

        // Updating the position of the box in the THREE.js world
        this.instance.position.copy(
            this.physicInstance.position as unknown as THREE.Vector3
        );
    }
}

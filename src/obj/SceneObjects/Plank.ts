import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import SceneObject from "./SceneObject";
import World from "../World";
import { Body, Box, Vec3, Material } from "cannon-es";
import { INITIAL_X, INITIAL_Y, NB_PLANKS } from "../../main";
import woodRoughnessMap from "../../../assets/textures/wood/wood-roughness.png";
import woodNormalMap from "../../../assets/textures/wood/wood-normal.png";
import woodMap from "../../../assets/textures/wood/wood.png";
import woodAoMap from "../../../assets/textures/wood/wood-ao.png";

// Loading the texture
const plankRoughnessMap = new THREE.TextureLoader().load(woodRoughnessMap);
const plankNormalMap = new THREE.TextureLoader().load(woodNormalMap);
const plankMap = new THREE.TextureLoader().load(woodMap);
const plankAoMap = new THREE.TextureLoader().load(woodAoMap);

type PlankPosition = {
    x: number;
    y: number;
    z: number;
};

const PLANK_HEIGHT = 0.5;
const PLANK_WIDTH = 3;
const PLANK_DEPTH = 3;
const SPEED = 0.5;

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
            type: Body.KINEMATIC,
            shape: boxShape,
            position: new Vec3(
                this.initialPosition.x,
                this.initialPosition.y,
                this.initialPosition.z
            ),
            material: new Material("default")
        });

        this.world.instance.addBody(this.physicInstance);

        // Create a sphere in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.BoxGeometry(PLANK_WIDTH, PLANK_HEIGHT, PLANK_DEPTH),
            new THREE.MeshStandardMaterial({
                map: plankMap,
                roughnessMap: plankRoughnessMap,
                normalMap: plankNormalMap,
                aoMap: plankAoMap,
                roughness: 0.5,
                metalness: 0.2
            })
        );

        // Add shadows
        this.instance.castShadow = true;
        this.instance.receiveShadow = true;

        // Define position
        this.instance.position.set(
            this.initialPosition.x,
            this.initialPosition.y,
            this.initialPosition.z
        );

        // Add the box to the scene
        this.scene.threeScene.add(this.instance);
    }

    onRender(): void {
        // Updating the position of the box in the CANNON world
        this.physicInstance.position.set(
            this.instance.position.x + 0.025 * SPEED,
            this.instance.position.y + 0.01 * SPEED,
            this.instance.position.z
        );

        // When the box is out of the scene, we move it back to the beginning
        if (this.physicInstance.position.x > NB_PLANKS * 3 + INITIAL_X) {
            this.physicInstance.position.set(
                INITIAL_X,
                INITIAL_Y + PLANK_HEIGHT / 2,
                0
            );
        }

        // Updating the position of the box in the THREE.js world
        this.instance.position.copy(
            this.physicInstance.position as unknown as THREE.Vector3
        );
    }
}

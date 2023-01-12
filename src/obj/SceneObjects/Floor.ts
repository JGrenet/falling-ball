import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import SceneObject from "./SceneObject";
import * as CANNON from "cannon";
import World from "../World";

export default class Floor implements SceneObject {
    physicInstance: CANNON.Body;
    instance: Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        // Create a plane in CANNON world
        const floorShape = new CANNON.Plane();
        this.physicInstance = new CANNON.Body({
            mass: 0,
            shape: floorShape
        });
        // Rotate the floor
        this.physicInstance.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            -Math.PI / 2
        );
        this.world.instance.addBody(this.physicInstance);

        // Create a plane in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({ color: "#ffffff" })
        );
        this.instance.receiveShadow = true;
        this.instance.rotation.x = -Math.PI * 0.5;

        scene.threeScene.add(this.instance);
    }

    onRender(): void {
        this.instance.position.copy(
            this.physicInstance.position as unknown as THREE.Vector3
        );
    }
}

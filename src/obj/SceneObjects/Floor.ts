import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import SceneObject from "./SceneObject";
import { Plane, Vec3, Body } from "cannon-es";
import World from "../World";

export default class Floor implements SceneObject {
    physicInstance: Body;
    instance: Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        // Create a plane in CANNON world
        const floorShape = new Plane();
        this.physicInstance = new Body({
            mass: 0,
            shape: floorShape
        });
        // Rotate the floor
        this.physicInstance.quaternion.setFromAxisAngle(
            new Vec3(1, 0, 0),
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

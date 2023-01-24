import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import { Sphere, Vec3, Body } from "cannon-es";
import World from "../World";
import SceneObject from "./SceneObject";

export default class Ball implements SceneObject {
    physicInstance: Body;
    instance: Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        const position = {
            x: 0,
            y: 7,
            z: 0
        };

        // Create a sphere in CANNON world
        const sphereShape = new Sphere(1);
        this.physicInstance = new Body({
            mass: 100,
            position: new Vec3(position.x, position.y, position.z),
            shape: sphereShape
        });

        this.world.instance.addBody(this.physicInstance);

        // Create a sphere in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshStandardMaterial({ color: "#FF00ee" })
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

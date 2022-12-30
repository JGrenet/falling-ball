import Scene from "./Scene";
import * as THREE from "three";

export default class Floor {
    constructor(scene: Scene) {
        scene.threeScene.add(
            new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1),
                new THREE.MeshStandardMaterial({ color: "#ffffff" })
            )
        );
    }
}

import Scene from "../Scene";
import * as THREE from "three";
import SceneObject from "./SceneObject";

export default class SpotLight implements SceneObject {
    instance: THREE.SpotLight;

    constructor(scene: Scene) {
        // Create a THREE.js spot light
        this.instance = new THREE.SpotLight(
            0xffffff,
            15,
            60,
            Math.PI / 11,
            0.5
        );
        this.instance.position.set(40, 30, 0);

        // Add light position to lil-gui
        scene.gui.add(this.instance.position, "x", -40, 40);
        scene.gui.add(this.instance.position, "y", 0, 30);
        scene.gui.add(this.instance.position, "z", -10, 10);

        // Active shadows
        this.instance.castShadow = true;
        this.instance.shadow.mapSize.width = 1024;
        this.instance.shadow.mapSize.height = 1024;

        scene.threeScene.add(this.instance);

        // Add Helpers
        // const spotLightHelper = new THREE.SpotLightHelper(this.instance);
        // scene.threeScene.add(spotLightHelper);
    }

    onRender(): void {}
}

import * as THREE from "three";
import Scene from "../Scene";

const COUNT = 3000;

export default class Particles {
    public instance: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

    constructor(private scene: Scene) {
        const particles = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT * 3; i += 3) {
            particles[i] = Math.random() * 200 - 100;
            particles[i + 1] = Math.random() * 200 - 100;
            particles[i + 2] = Math.random() * 200 - 100;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particles, 3)
        );

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1
        });

        this.instance = new THREE.Points(geometry, material);
        this.scene.threeScene.add(this.instance);
    }
}

import Scene from "../Scene";
import * as THREE from "three";
import { Mesh } from "three";
import { Sphere, Vec3, Body, Material } from "cannon-es";
import World from "../World";
import SceneObject from "./SceneObject";
import texture from "../../../assets/textures/yellow-metal/texture.png";
import metalAoMap from "../../../assets/textures/yellow-metal/ao.png";
import metalNormalMap from "../../../assets/textures/yellow-metal/normal.png";
import metalRoughnessMap from "../../../assets/textures/yellow-metal/roughness.png";
import metalMetalnessMap from "../../../assets/textures/yellow-metal/metallic.png";
import metalHeightMap from "../../../assets/textures/yellow-metal/height.png";

// Loading the texture
const ballMap = new THREE.TextureLoader().load(texture);
const ballAoMap = new THREE.TextureLoader().load(metalAoMap);
const ballNormalMap = new THREE.TextureLoader().load(metalNormalMap);
const ballRoughnessMap = new THREE.TextureLoader().load(metalRoughnessMap);
const ballMetalnessMap = new THREE.TextureLoader().load(metalMetalnessMap);
const ballHeightMap = new THREE.TextureLoader().load(metalHeightMap);

export default class Ball implements SceneObject {
    physicInstance: Body;
    instance: Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;

    constructor(scene: Scene, private world: World) {
        const position = {
            x: 20,
            y: 14,
            z: 0
        };

        // Create a sphere in CANNON world
        const sphereShape = new Sphere(1);
        this.physicInstance = new Body({
            mass: 1,
            position: new Vec3(position.x, position.y, position.z),
            shape: sphereShape,
            linearDamping: 0.9,
            material: new Material("default")
        });

        this.world.instance.addBody(this.physicInstance);

        // Create a sphere in THREE.js world
        this.instance = new THREE.Mesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshStandardMaterial({
                map: ballMap,
                aoMap: ballAoMap,
                normalMap: ballNormalMap,
                roughnessMap: ballRoughnessMap,
                metalnessMap: ballMetalnessMap,
                displacementMap: ballHeightMap,
                displacementScale: 0.1,
                roughness: 0.5,
                metalness: 0.5
            })
        );

        // Add shadows
        this.instance.castShadow = true;
        this.instance.receiveShadow = true;

        // Define position
        this.instance.position.set(position.x, position.y, position.z);

        // Add it to the scene
        scene.threeScene.add(this.instance);
    }

    onRender(): void {
        this.instance.position.copy(
            this.physicInstance.position as unknown as THREE.Vector3
        );

        this.instance.quaternion.copy(
            this.physicInstance.quaternion as unknown as THREE.Quaternion
        );
    }

    push(): void {
        // Apply force to the ball
        this.physicInstance.applyForce(new Vec3(-50, 0, 0), new Vec3(0, 0, 0));
    }
}

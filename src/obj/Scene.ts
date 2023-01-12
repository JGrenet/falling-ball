import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import World from "./World";
import SceneObject from "./SceneObjects/SceneObject";

export default class Scene {
    // Canvas
    canvasSizeWidth: number = window.innerWidth;
    canvasSizeHeight: number = window.innerHeight;

    // Three.js scene
    threeScene: THREE.Scene;

    // Scene utils
    camera: THREE.PerspectiveCamera;
    cameraControls: OrbitControls;
    webGlRenderer: THREE.WebGLRenderer;

    constructor(axesHelper: boolean = false) {
        const canvas = document.querySelector("canvas.webgl") as HTMLElement;

        // Scene
        this.threeScene = new THREE.Scene();

        // Base camera
        this.setupCamera();

        // Controls
        this.setupOrbitControls(canvas);

        // Renderer
        this.setupRenderer(canvas);

        // global Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.threeScene.add(ambientLight);

        // Axes helpers
        if (axesHelper) {
            // X axis is Red
            // Y axis is Green
            // Z axis is blue
            const axesHelper = new THREE.AxesHelper(5);
            this.threeScene.add(axesHelper);
        }

        window.addEventListener("resize", () => {
            // Update sizes
            this.canvasSizeWidth = window.innerWidth;
            this.canvasSizeHeight = window.innerHeight;

            // Update camera
            this.camera.aspect = this.canvasSizeWidth / this.canvasSizeHeight;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.webGlRenderer.setSize(
                this.canvasSizeWidth,
                this.canvasSizeHeight
            );
            this.webGlRenderer.setPixelRatio(
                Math.min(window.devicePixelRatio, 2)
            );
        });
    }

    private setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvasSizeWidth / this.canvasSizeHeight,
            0.1,
            100
        );

        this.camera.position.set(10, 6, 8);
        this.threeScene.add(this.camera);
    }

    private setupOrbitControls(canvas: HTMLElement) {
        this.cameraControls = new OrbitControls(this.camera, canvas);
        this.cameraControls.enableDamping = true;
    }

    private setupRenderer(canvas: HTMLElement) {
        this.webGlRenderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.webGlRenderer.shadowMap.enabled = true;
        this.webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.webGlRenderer.setSize(this.canvasSizeWidth, this.canvasSizeHeight);
        this.webGlRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    public render(world: World, objs: SceneObject[]) {
        // Update controls
        this.cameraControls.update();

        // Step the physics simulation
        world.instance.step(1 / 60);

        // Update objects
        objs.forEach(obj => {
            obj.onRender();
        });

        // Render
        this.webGlRenderer.render(this.threeScene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(() => {
            this.render(world, objs);
        });
    }
}

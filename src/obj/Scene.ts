import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import World from "./World";
import SceneObject from "./SceneObjects/SceneObject";
import CannonDebugger from "cannon-es-debugger";
import * as dat from "lil-gui";
import Ball from "./SceneObjects/Ball";

export default class Scene {
    // Canvas
    canvasSizeWidth: number = window.innerWidth;
    canvasSizeHeight: number = window.innerHeight;

    // Three.js scene
    threeScene: THREE.Scene;

    // Scene utils
    camera!: THREE.PerspectiveCamera;
    cameraControls!: OrbitControls;
    webGlRenderer!: THREE.WebGLRenderer;
    // @ts-ignore
    cannonDebugRenderer!: CannonDebugger;

    constructor(
        helpers: boolean = false,
        private world: World,
        public gui: dat.GUI
    ) {
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
        if (helpers) {
            // X axis is Red
            // Y axis is Green
            // Z axis is blue
            const axesHelper = new THREE.AxesHelper(5);
            this.threeScene.add(axesHelper);

            // Enable Cannon debug renderer
            // @ts-ignore
            this.cannonDebugRenderer = new CannonDebugger(
                this.threeScene,
                this.world.instance
            );
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

        this.threeScene.add(this.camera);

        // Camera GUI
        const cameraFolder = this.gui.addFolder("Camera");
        cameraFolder.add(this.camera.position, "x").min(-10).max(10).step(0.01);
        cameraFolder.add(this.camera.position, "y").min(-10).max(10).step(0.01);
        cameraFolder.add(this.camera.position, "z").min(-10).max(30).step(0.01);
        cameraFolder.open();
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

    public render(objs: SceneObject[], ball: Ball) {
        // Update controls (activate for debug)
        // this.cameraControls.update();

        // Update camera position to follow the ball
        this.camera.lookAt(ball.instance.position);

        this.camera.position.set(
            ball.instance.position.x + 2,
            ball.instance.position.y + 0,
            ball.instance.position.z - 5
        );

        // Step the physics simulation
        this.world.instance.step(1 / 60);

        // Update objects
        objs.forEach(obj => {
            obj.onRender();
        });

        // Update debug renderer
        if (this.cannonDebugRenderer) {
            this.cannonDebugRenderer.update();
        }

        // Render
        this.webGlRenderer.render(this.threeScene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(() => {
            this.render(objs, ball);
        });
    }
}

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

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

    constructor() {
        const canvas = document.querySelector("canvas.webgl") as HTMLElement;

        // Scene
        this.threeScene = new THREE.Scene();

        // Base camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvasSizeWidth / this.canvasSizeHeight,
            0.1,
            100
        );
        this.camera.position.set(-3, 3, 3);
        this.threeScene.add(this.camera);

        // Controls
        this.cameraControls = new OrbitControls(this.camera, canvas);
        this.cameraControls.enableDamping = true;

        // Renderer
        this.webGlRenderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.webGlRenderer.shadowMap.enabled = true;
        this.webGlRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.webGlRenderer.setSize(this.canvasSizeWidth, this.canvasSizeHeight);
        this.webGlRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // global Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.threeScene.add(ambientLight);
    }

    public render() {
        // Update controls
        this.cameraControls.update();

        // Render
        this.webGlRenderer.render(this.threeScene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(this.render.bind(this));
    }
}

import * as CANNON from "cannon";

// Define the CANNON world object
export default class World {
    instance: CANNON.World;

    constructor() {
        this.instance = new CANNON.World();

        // Mimic the gravity of earth
        this.instance.gravity.set(0, -9.82, 0);
    }
}

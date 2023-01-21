import { World as CannonWorld, Material, ContactMaterial } from "cannon-es";

// Define the CANNON world object
export default class World {
    instance: CannonWorld;

    constructor() {
        this.instance = new CannonWorld();

        // Mimic the gravity of earth
        this.instance.gravity.set(0, -9.82, 0);

        // Create a default contact material
        this.createDefaultContactMaterial();
    }

    createDefaultContactMaterial() {
        const defaultMaterial = new Material("default");

        const defaultContactMaterial = new ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 1,
                restitution: 0.2
            }
        );

        this.instance.addContactMaterial(defaultContactMaterial);
        this.instance.defaultContactMaterial = defaultContactMaterial;
    }
}

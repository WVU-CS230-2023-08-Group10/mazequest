import { Renderer } from "./Renderer.js";
import { Transform } from "./Transform.js";
export {Entity};

class Entity
{
    name;
    transform;
    renderer;

    constructor(name = "", transform = new Transform(), renderer = new Renderer()) 
    {
        if (!(transform instanceof Transform))
            throw new Error("Type mismatch: transform parameter is not of type Transform (was "+typeof transform+" instead).");
        if (!(renderer instanceof Renderer))
            throw new Error("Type mismatch: renderer parameter is not of type Renderer (was "+typeof renderer+" instead).");
        this.transform = transform;
        this.renderer = renderer;
    }

    update(delta) {}

    render(delta)
    {
        this.renderer.transform = this.transform;
        this.renderer.update(delta);
    }

    broadcast(event) {}

    translate() {}
}
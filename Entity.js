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
        this.transform = transform;
    }

    update() {}

}
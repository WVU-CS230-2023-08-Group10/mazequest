import { Renderer } from "./Renderer.js";
import { Transform } from "./Transform.js";
export {Entity};

/**
 * Class representing a game object.
 * 
 * Fields:
 *  - name : String
 *  - transform : Transform
 *  - renderer : Renderer
 * 
 * Methods:
 *  - {@link update} : Expects to run every frame. Should be overridden by classes extending this.
 *  - {@link render} : Updates the renderer's transform an updates the corresponding pixi sprite.
 *  - {@link broadcast} : Broadcasts an event to the entity. Should be overridden by classes extending this.
 */
class Entity
{
    name;
    transform;
    renderer;
    game;

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined) 
    {
        if (!(transform instanceof Transform))
            throw new Error("Type mismatch: transform parameter is not of type Transform (was "+typeof transform+" instead).");
        if (!(renderer instanceof Renderer))
            throw new Error("Type mismatch: renderer parameter is not of type Renderer (was "+typeof renderer+" instead).");
        
        this.transform = transform;
        this.renderer = renderer;
        this.game = game;
    }

    update(delta) {}

    render(delta)
    {
        this.renderer.transform = this.transform;
        this.renderer.update(delta);
    }

    broadcast(event) {}
}
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

    /**
     * Construct a new abstract Entity. Considering as a base, Entity only contains renderer and transform information,
     * you should probably only do this to render images that have no implicit behaviour.
     * 
     * @param {String} name Name of the entity.
     * @param {Transform} transform Entity position, scale, and rotation.
     * @param {Renderer} renderer Entity renderer
     * @param {Game} game The Game this is attached to (if any)
     */
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined) 
    {
        if (!(transform instanceof Transform))
            throw new Error("Type mismatch: transform parameter is not of type Transform (was "+transform.constructor.name+" instead).");
        if (!(renderer instanceof Renderer))
            throw new Error("Type mismatch: renderer parameter is not of type Renderer (was "+renderer.constructor.name+" instead).");
        
        this.transform = transform;
        this.renderer = renderer;
        this.game = game;
        this.name = name;
    }

    update(delta) {}

    /**
     * Updates the renderer's transform member to match this entities transform member,
     * then renders the renderer.
     * @param {number} delta The time passed since the last render call. 
     */
    render(delta)
    {
        this.renderer.transform = this.transform;
        this.renderer.update(delta);
    }

    broadcast(event) {}

    /**
     * Unregisters this entity from its respective game's registry, disposes its renderer,
     * and deletes itself.
     */
    destroy()
    {
        if (this.game == undefined)
            return;

        this.game.unregisterEntity(this);
        this.renderer.dispose();
        delete this;
    }

    /**
     * Simple shorthand for `this.constructor.name`
     * @returns The Type of this Entity.
     */
    getType()
    {
        return this.constructor.name;
    }
}
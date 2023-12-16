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
    _Name;
    _Transform;
    _Renderer;
    
    game;
    uuid;

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
        
        this.uuid = crypto.randomUUID();

        this.game.registerEntity(this);
    }

    get name() {
        return this._Name;
    }
    set name(n) {
        this._Name = n;
    }
    get transform() {
        return this._Transform;
    }
    set transform(t)
    {
        this._Transform = t;
    }
    get renderer() {
        return this._Renderer;
    }
    set renderer(r) {
        this._Renderer = r;
    }

    getID()
    {
        return this.uuid;
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
    }

    /**
     * Simple shorthand for `this.constructor.name`
     * @returns The Type of this Entity.
     */
    getType()
    {
        return this.constructor.name;
    }

    /**
     * Serializes the entity into a JSON object string
     * @returns the JSON string representation
     */
    serialize()
    {
        return '{ "type":"Entity", "name": "' + this.name + '", "transform": ' + this.transform.serialize() + ', "renderer": '
            + this.renderer.serialize() + '}';
    }

    /**
     * Deserializes the JSON object into an entity
     * @param {*} obj the JSON object
     * @param {*} game the current game instance
     * @returns the new entity 
     */
    static deserialize(obj, game)
    {
        return new Entity(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
    }
}
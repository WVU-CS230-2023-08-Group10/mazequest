import {Entity} from "./Entity.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
export {Collider, ExitIndicator};

class Collider extends Entity
{
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game=undefined)
    {
        super(name, transform, renderer, game);
    }

    /**
     * Serializes the Collider into a JSON string
     * @returns JSON string representation of Collider entity
     */
    serialize()
    {
        return '{ "type":"Collider", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + '}';
    }

    /**
     * Deserializes a JSON object into a Collider entity
     * @param {*} obj the JSON object
     * @param {*} game the current game instance
     * @returns 
     */
    static deserialize(obj, game)
    {
        return new Collider(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
    }
}

class ExitIndicator extends Entity
{
    constructor(name = "ExitIndicator", transform = new Transform(), renderer = new Renderer(), game=undefined)
    {
        super(name, transform, renderer, game);
    }

    /**
     * Updates the status & information of the entity.
     * In this case, the entity is deleted when in the actual game.
     * @param {*} delta 
     */
    update(delta)
    {
        // Whenever we are updating the game (so outside the level builder) we want to delete this entity.
        this.game.unregister(this);
    }
    
    /**
     * Serializes the exit indicator into a JSON object string
     * @returns the JSON string representation of the exit indicator
     */
    serialize()
    {
        return '{ "type":"ExitIndicator", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + '}';
    }

    /** 
     * Deserializes the JSON object into an exit indicator entity
     * @param {*} obj the JSON object
     * @param {*} game the current game instance
     * @returns the new exit indicator entity
     */
    static deserialize(obj, game)
    {
        return new ExitIndicator(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
    }
}
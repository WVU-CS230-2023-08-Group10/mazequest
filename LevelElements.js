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

    serialize()
    {
        return '{ "type":"Collider", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + '}';
    }

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

    update(delta)
    {
        // Whenever we are updating the game (so outside the level builder) we want to delete this entity.
        this.game.unregister(this);
    }

    serialize()
    {
        return '{ "type":"ExitIndicator", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + '}';
    }

    static deserialize(obj, game)
    {
        return new ExitIndicator(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
    }
}
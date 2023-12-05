import {Entity} from "./Entity.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
export {Collider};

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
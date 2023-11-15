import {Entity} from "./Entity.js";
export {Collider};

class Collider extends Entity
{
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game=undefined)
    {
        super(name, transform, renderer, game);
    }

    serialize()
    {
        return '{ "type":"Collider", "name": "' + this.name + '", "transform": ' + this.transform.serialize() + ', "renderer": '
            + this.renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    static deserialize(obj, game)
    {
        return new Collider(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
    }
}
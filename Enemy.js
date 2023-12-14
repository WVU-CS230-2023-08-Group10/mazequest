import { Mob } from "./Mob.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { PriorityList, Action } from "./PriorityList.js";
import { Inventory } from "./Inventory.js";
export {Enemy};

/**
 * Class representing the Enemy entity
 * 
 * @extends Mob
 */
class Enemy extends Mob 
{

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined, health = 1, hostile = undefined, AIDict = new PriorityList([new Action("Move", 1, 1, 1)]))
    {
        super(name, transform, renderer, game, health, hostile, AIDict);
    }

    /**
     * Creates a simplified JSON version of an instance of an enemy, keeping only the important information to be used.
     * @returns the serialized enemy as a string.
     */
    serialize()
    {
        return '{ "type":"Enemy", "name": "' + this.name + '", "transform": ' + this.transform.serialize() + ', "renderer": '
            + this.renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    /**
     * Take an object that has been serialized and turn it into an instance of enemy.
     * @param {*} obj - object to deserialize.
     * @param {*} game - instance of game used to derserialize the fields into usable fields.
     * @returns new instance of enemy with intialized fields if applicable.
     */
    static deserialize(obj, game)
    {
        const p = new Enemy(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game);
        p.inventory = Inventory.deserialize(obj.inventory, game);
        return p;
    }
}
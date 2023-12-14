
import { Mob } from "./Mob.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
export {Enemy};

/**
 * Class representing the Enemy entity
 * 
 * @extends Mob
 */
class Enemy extends Mob 
{
    enemyName;
    enemyHealth;
    inventory;
    enemyHostile;

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    actionDict = new PriorityList();

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined, health = 1, hostile = undefined, AIDict = new PriorityList([new Action(), new Action(), new Action()])) {
    {
        super(name, transform, renderer, game);

        this.enemyName = name;
        this.enemyHealth = health;
        this.inventory = new Inventory();
        this.enemyHostile = hostile;
        this.actionDict = AIDict;
    }

    /**
     * Creates a simplified JSON version of an instance of an enemy, keeping only the important information to be used.
     * @returns the serialized enemy as a string.
     */
    serialize()
    {
        return '{ "type":"Enemy", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    /**
     * Take an object that has been serialized and turn it into an instance of enemy.
     * @param {*} obj - object to deserialize.
     * @param {*} game - instance of game used to derserialize the fields into usable fields.
     * @returns new instance of enemy with intialized fields if applicable.
     */
    static deserialize(obj, game)
    {
        const p = new Enemy(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game)
        p.inventory = Inventory.deserialize(obj.inventory, game);
        return p;
    }
}
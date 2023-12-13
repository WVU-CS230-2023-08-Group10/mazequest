import { Entity } from "./Entity.js";
import { Renderer } from "./Renderer.js";
import { Transform } from "./Transform.js";

export { Item, Weapon, Armor, Consumable };

class Item extends Entity
{
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined) 
    {
        super(name, transform, renderer, game);
    }
      
    static isWeapon(obj)
    {
        return obj instanceof Weapon;
    }
    static isArmor(obj)
    {
        return obj instanceof Armor;
    }
    static isConsumable(obj)
    {
        return obj instanceof Consumable;
    }
    
    equals(obj)
    {
        if (!(obj instanceof Item))
            return false;

        if (this.itemName == obj.itemName)
            return true;
    }
}

class Weapon extends Item
{
    lowDamage;
    highDamage;
    trace;

    constructor(name, lowDamage, highDamage, trace, renderer, transform = new Transform(), game = undefined)
    {
        super(name, transform, renderer, game);
        
        this.lowDamage = lowDamage;
        this.highDamage = highDamage;
        this.trace = trace;
    }

    /**
     * Returns the amount of damage this weapon should deal, based on an external accuracy value.
     * The accuracy number, which should be between 0 and 1, scales the damage from the weapons
     * predefined minimum damage to its maximum damage.
     * 
     * @param {Number} accuracy A number (float) between 0 and 1 that determines how much to scale the damage
     * @returns Returns a number that represents the amount of damage to be dealt based on the given accuracy.
     */
    damage(accuracy)
    {
        return accuracy * (highDamage - lowDamage) + lowDamage;
    }

    getTrace()
    {
        return this.trace;
    }
    serialize()
    {
        return '{ "type":"Weapon", "name":"' + this._Name +
            '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "damage": { "low":' + this.lowDamage + ', "high":' + this.highDamage + '}' 
            + ', "trace":"' + this.trace + '" }';
    }

    static deserialize(obj, game)
    {
        return new Weapon(obj.name, obj.damage.low, obj.damage.high, obj.trace, Renderer.deserialize(obj.renderer, game.stage));
    }
}

class Armor extends Item
{
    lowProtection;
    highProtection;
    trace;

    constructor(name, lowProtection, highProtection, trace, renderer, transform = new Transform(), game = undefined)
    {
        super(name, transform, renderer, game);
        this.lowProtection = lowProtection;
        this.highProtection = highProtection;
        this.trace = trace;
    }

    protection(accuracy)
    {
        return accuracy * (highProtection - lowProtection) + lowProtection;
    }

    serialize()
    {
        return '{ "type":"Armor", "name" : "' + this._Name 
            + '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "protection":' + this.protection + '}';
    }

    static deserialize(obj, game)
    {
        return new Armor(obj.name, obj.protection, Renderer.deserialize(obj.renderer), Transform.deserialize(obj.transform), game);
    }
}

class Consumable extends Item
{
    stackCount;

    constructor(name, renderer, count = 1, transform = new Transform(), game = undefined)
    {
        super(name, transform, renderer, game);
        this.stackCount = count;
    }

    /**
     * Stacks this item with another consumable, combining their stack counts.
     * 
     * @param {Consumable} consumable The consumable to stack into this.
     */
    stack(consumable)
    {
        this.stackCount += consumable.stackCount;
    }

    serialize()
    {
        return '{ "type":"Consumable", "name" : "' + this._Name 
            + '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "count":' + this.stackCount + '}';
    }

    static deserialize(obj, game)
    {
        return new Consumable(obj.name, Renderer.deserialize(obj.renderer), obj.count, Transform.deserialize(obj.transform), game);
    }
}
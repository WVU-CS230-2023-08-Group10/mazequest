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
    
    /**
     * Checks if passed item is a weapon
     * @param {*} item 
     * @returns boolean result of statement
     */
    static isWeapon(item)
    {
        return item instanceof Weapon;
    }

    /**
     * Checks if passed item is an armor set
     * @param {*} item 
     * @returns boolean result of statement
     */
    static isArmor(item)
    {
        return item instanceof Armor;
    }

    /**
     * Checks if passed item is a consumable
     * @param {*} item 
     * @returns boolean result of statement
     */
    static isConsumable(item)
    {
        return item instanceof Consumable;
    }
    
    /**
     * Take an object, checks if it is an item. If so, compares their names to check for equality
     * @param {*} obj represents the object being compared
     * @returns boolean result of comparison
     */
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

    /**
     * @returns trace pattern of this weapon
     */
    getTrace()
    {
        return this.trace;
    }

    /**
     * Serializes Weapon object to a string representation of a JSON object
     * @returns the JSON string of this weapon
     */
    serialize()
    {
        return '{ "type":"Weapon", "name":"' + this._Name +
            '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "damage": { "low":' + this.lowDamage + ', "high":' + this.highDamage + '}' 
            + ', "trace":"' + this.trace + '" }';
    }

    /**
     * Deserializes the passed JSON to a new Weapon object
     * @param {*} obj the JSON object representation
     * @param {*} game the current game instance
     * @returns a new Weapon object defined by the JSON object
     */
    static deserialize(obj, game)
    {
        return new Weapon(obj.name, obj.damage.low, obj.damage.high, obj.trace, Renderer.deserialize(obj.renderer, game.stage), Transform.deserialize(obj.transform), game);
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

    /**
     * Calculates the protection value of this armor due to an attack
     * @param {Number} accuracy 
     * @returns the value of protection calculated via the accuracy of an associated attack
     */
    protection(accuracy)
    {
        return accuracy * (highProtection - lowProtection) + lowProtection;
    }

    /**
     * Serializes the current armor object into a JSON string
     * @returns the JSON string of this Armor object
     */
    serialize()
    {
        return '{ "type":"Armor", "name" : "' + this._Name 
            + '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "protection":' + this.protection + '}';
    }

    /**
     * Deserializes & establishes a new Armor object based on the passed JSON representation
     * @param {*} obj the JSON object 
     * @param {*} game the current game instance
     * @returns a new Armor object created from the passed JSON
     */
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

    /**
     * Serializes the current consumable object into a JSON string
     * @returns the JSON string of this consumable object
     */
    serialize()
    {
        return '{ "type":"Consumable", "name" : "' + this._Name 
            + '", "transform": ' + this.transform.serialize() + ', "renderer": ' + this.renderer.serialize() 
            + '", "count":' + this.stackCount + '}';
    }

    /**
     * Deserializes & establishes a new consumable object based on the passed JSON representation
     * @param {*} obj the JSON object 
     * @param {*} game the current game instance
     * @returns a new consumable object created from the passed JSON
     */
    static deserialize(obj, game)
    {
        return new Consumable(obj.name, Renderer.deserialize(obj.renderer), obj.count, Transform.deserialize(obj.transform), game);
    }
}
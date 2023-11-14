import { Entity } from "./Entity.js";

export {Item, Weapon, Armor, Consumable};

class Item extends Entity
{
    itemName;

    constructor(name){
        this.itemName = name;
    }
    get getName(){
        return this.itemName;
    }
    set setName(name){
        this.itemName = name;
    }
      
    isWeapon(Item){
        return Item instanceof Weapon;
    }
    isArmor(Item){
        return Item instanceof Armor;
    }
    isConsumable(Item){
        return Item instanceof Consumable;
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
    constructor(name, lowDamage, highDamage){
        super(name);
        this.lowDamage = lowDamage;
        this.highDamage = highDamage;
    }
    damage(){
        return Math.random()*(highDamage-lowDamage) + lowDamage;
    }

    serialize()
    {
        return '{ "type":"Weapon", "name" : "'+this.name+'", "damage": { "low":'+this.lowDamage+', "high":'+this.highDamage+'}}';
    }

    static deserialize(obj, game)
    {
        return new Weapon(obj.name, obj.damage.low, obj.damage.high);
    }
}
class Armor extends Item{
    constructor(name, protection){
        super(name);
        this.protection=protection;
    }

    serialize()
    {
        return '{ "type":"Armor", "name" : "'+this.name+'", "protection":'+this.protection+'}';
    }

    static deserialize(obj, game)
    {
        return new Armor(obj.name, obj.protection);
    }
}

class Consumable extends Item
{
    stackCount;

    constructor(name, count = 1)
    {
        super(name);
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
        return '{ "type":"Consumable", "name" : "'+this.name+'", "count":'+this.stackCount+'}';
    }

    static deserialize(obj, game)
    {
        return new Consumable(obj.name, obj.count);
    }
}
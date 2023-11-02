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
class Weapon extends Item{
    constructor(name, lowDamage, highDamage){
        super(name);
        this.lowDamage = lowDamage;
        this.highDamage = highDamage;
    }
    damage(){
        return Math.random()*(highDamage-lowDamage) + lowDamage;
    }
}
class Armor extends Item{
    constructor(name, protection){
        super(name);
        this.protection=protection;
    }
}
//Currently unavailable in your region
// class Utility extends Item{

// }
class Consumable extends Item
{
    stackCount;

    constructor(name)
    {
        super(name);
        stackCount = 1;
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
}
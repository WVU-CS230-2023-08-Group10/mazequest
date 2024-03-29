import { Item, Weapon, Armor, Consumable } from "./Item.js";
export { Inventory };

/**
 * Class representing the player's inventory
 * 
 * Fields:
 *  - weapon : the player's currently equipped weapon
 *  - armor : the player's currently equipped armor
 *  - consumables : list to keep all of the player's consumable items
 * 
 */
class Inventory
{
    weapon;
    armor;
    consumables;

    constructor(weapon = null, armor = null, consumables = [])
    {
        this.weapon = weapon;
        this.armor = armor;
        this.consumables = consumables;
    }

    /**
     * Gets the currently equipped weapon
     * @returns returns this weapon
     */
    getWeapon()
    {
        return this.weapon;
    }

    /**
     * Gets the currently equipped armor
     * @returns Returns this armor
     */
    getArmor()
    {
        return this.armor;
    }

    /**
     * Checks if the inventory contains any consumables.
     * @return True if the inventory contains consumables, false if empty.
     */
    hasConsumable()
    {
        return this.consumables.length > 0;
    }

    /**
     * Stores an item in the inventory. If something needs to be dropped to store, returns an item. 
     * Otherwise, return null;
     * @param {Item} item
     * @returns {Item?} item to drop, if applicable
     */
    store(item)
    {
        if (Item.isWeapon(item))
        {
            const currentWeapon = this.weapon;
            this.weapon = item;
            return currentWeapon;
        }
        else if (Item.isArmor(item))
        {
            const currentArmor = this.armor;
            this.armor = item;
            return currentArmor;
        }
        else if (Item.isConsumable(item))
        {
            const stackableItem = this.consumables.find((e) => e.equals(item));
            if (stackableItem == undefined)
            {
                this.consumables.push(item);
            }
            else
            {
                stackableItem.stackCount++;
            }
        }
    }

    /**
     * Drops the item passed as a parameter. If the item is the currently equipped weapon,
     * the weapon is set to null, if it is the currently equipped armor, the armor is set to null.
     * If the item is a consumable, the item is checked among the item's in the inventory, and if
     * if its in the list, the item is removed.
     * @param {*} item - item to remove from the inventory
     * @returns - true if the item is removed, false if the item is not in the inventory
     */
    drop(item)
    {
        if (this.weapon.equals(item))
        {
            this.weapon = null;
            return true;
        }
        else if (this.armor.equals(item))
        {
            this.armor = null;
            return true;
        }
        else
        {
            const index = this.consumables.findIndex((e) => e.equals(item));
            if (index != -1)
            {
                this.consumables.splice(index, 1);
                return true;
            }
            return false;
        }
    }

    /**
     * Creates a simplified JSON version of an instance of an object, keeping only the important information to be used.
     * @returns - returns the serialized object as a string.
     */
    serialize()
    {
        const weapon_serialized = (this.weapon == null) ? "null" : this.weapon.serialize();
        const armor_serialized = (this.armor == null) ? "null" : this.armor.serialize();
        let str = '{ "type":"Inventory", "weapon": "' + weapon_serialized + '", "armor": "' + armor_serialized + '", "consumables":[';
        for (let i = 0; i < this.consumables.length; i++)
        {
            const c = this.consumables[i];
            str += c.serialize();
            if (i != this.consumables.length-1)
                str += ', ';
        }
        str += ']}';
        return str;
    }

    /**
     * Take an object that has been serialized and turn it into an instance of inventory.
     * @param {*} obj - object to deserialize.
     * @param {*} game - instance of game used to derserialize the fields into usable fields.
     * @returns - returns new instance of inventory with intialized fields if applicable.
     */
    static deserialize(obj, game)
    {
        const consumables = [];
        for (c of obj.consumables)
            consumables.push(Consumable.deserialize(c));
        const w = (obj.weapon == "null") ? null : Weapon.deserialize(obj.weapon, game);
        const a = (obj.armor == "null") ? null : Armor.deserialize(obj.armor);
        return new Inventory(w, a, consumables);
    }
}
import { Item } from "./Item.js";
export {Inventory};

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

    getWeapon()
    {
        return this.weapon;
    }

    getArmor()
    {
        return this.armor;
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

    serialize()
    {
        const weapon_serialized = (this.weapon == null) ? null : this.weapon.serialize();
        const armor_serialized = (this.armor == null) ? null : this.armor.serialize();
        const str = '{ "type":"Inventory", "weapon":' + weapon_serialized + ', "armor":' + armor_serialized + ', "consumables":[';
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

    static deserialize(obj)
    {
        const consumables = [];
        for (c of obj.consumables)
            consumables.push(Consumable.deserialize(c));
        const w = (obj.weapon == null) ? null : Weapon.deserialize(obj.weapon);
        const a = (obj.armor == null) ? null : Armor.deserialize(obj.armor);
        return new Inventory(w, a, consumables);
    }
}
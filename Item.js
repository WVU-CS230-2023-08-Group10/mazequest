class Item extends Entity
{
    constructor(name){
        this.itemname=name;
    }
    get getName(){
        return this.itemname;
    }
    set setName(x){
        this.itemname=x;
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
class Consumable extends Item{
    constructor(name){
        super(name);
    }
}
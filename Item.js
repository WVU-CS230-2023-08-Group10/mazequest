class Item{
    constructor(name){
        this.itemname=name;
    }
    get IName(){
        return this.itemname;
    }
    set IName(x){
        this.itemname=x;
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
class ObscureObject extends Item{
    constructor(name){
        super(name);
    }
}
function isWeapon(Item){
    if(Item.Weapon){
        return true;
    }
    return false;
}
function isArmor(Item){
    if(Item.Armor){
        return true;
    }
    return false;
}
function isObscureObject(Item){
    if(Item.ObscureObject){
        return true;
    }
    return false;
}
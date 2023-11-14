import { Direction, Vector2 } from "./Vectors.js";
import { Armor, Consumable, Item, Weapon } from "./Item.js";
import { Inventory } from "./Player.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";

export {Enemy, NPC};

/**
 * Class representing generic mobs
 * 
 * @extends Entity
 */
class Mob extends Entity
{
    mobName;
    mobHealth;
    mobInventory;
    mobHostile;

    mobSpawn;
    
    
    constructor(name, health, hostile, transform = new Transform(), renderer = new Renderer(), game = undefined){
        
        super(name, transform, renderer, game);
        
        this.mobName = name;
        this.mobHealth = health;
        this.mobInventory = new Inventory();
        this.mobHostile = hostile;
    }

    get getName(){
        return this.mobName;
    }

    set setName(name){
        this.mobName = name;
    }

    get getHealth() {
        return this.mobHealth;
    }

    set setHealth(health) {
        this.mobHealth = health;
    }

    get getInventory() {
        return this.mobInventory;
    }

    set setInventory(inventory) {
        this.mobInventory = inventory;
    }

    get getHostile() {
        return this.mobHostile;
    }

    set setHostile(hostile) {
        this.mobHostile = hostile;
    }

    isEnemy(Mob){
        return Mob instanceof Enemy;
    }

    isNPC(Mob){
        return Mob instanceof NPC;
    }

    equals(obj)
    {
        if (!(obj instanceof Mob))
            return false;

        if (this.mobName == obj.mobName)
            return true;
    }

    pickUp(item) 
    {
        this.inventory.store(item);
    }
    drop(item)
    {
        this.inventory.drop(item);
    }
    damage(damageDone)
    {
        health-damageDone;
        if(health<1)
        {
            //enemy dies
        }
    }
}

class Enemy extends Mob 
{
    //enemy class
}

class NPC extends Mob 
{
    //NPC class
}
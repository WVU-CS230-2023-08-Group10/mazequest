import { Direction, Vector2 } from "./Vectors.js";
import { Armor, Consumable, Item, Weapon } from "./Item.js";
import { Inventory } from "./Inventory.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
import { PriorityList } from "./PriorityList.js";

export {Mob};

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

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    actionDict = new PriorityList();

    constructor(name, health, hostile, AIDict, transform = new Transform(), renderer = new Renderer(), game = undefined) {
        
        super(name, transform, renderer, game);
        
        this.mobName = name;
        this.mobHealth = health;
        this.mobInventory = new Inventory();
        this.mobHostile = hostile;
        this.actionDict = AIDict;
    }

    get getName() 
    {
        return this.mobName;
    }

    set setName(name) 
    {
        this.mobName = name;
    }

    get getHealth() 
    {
        return this.mobHealth;
    }

    set setHealth(health) 
    {
        this.mobHealth = health;
    }

    get getInventory() 
    {
        return this.mobInventory;
    }

    set setInventory(inventory) 
    {
        this.mobInventory = inventory;
    }

    get getHostile() 
    {
        return this.mobHostile;
    }

    set setHostile(hostile) 
    {
        this.mobHostile = hostile;
    }

    isEnemy(Mob) 
    {
        return Mob instanceof Enemy;
    }

    isNPC(Mob) 
    {
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
        health -= damageDone;
        if(health < 1)
        {
            //enemy dies
        }
    }

    initializeCombat() 
    {
        //call combat
    }

    position(room,tile)
    {
        this.room = room;
        this.tile = tile;
    }

    update(delta)
    {
        const difference = Vector2.subtract(this.moveTarget, this.transform.position);
        if (difference.getMagnitude() < 0.1)
        {
            this.transform.position = this.moveTarget.copy();
        }
        else
        {
            difference.normalize();
            difference.scalarMultiply(this.speed * delta);
            this.transform.translate(difference);
        }
    }

    move(direction)
    {
        const pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(direction, this.cellSize));

        if (pos.x < 0 || pos.x >= this.roomSize || pos.y < 0 || pos.y >= this.roomSize)
        {
            return;
        }

        this.moveTarget = pos;
    }

    broadcast(event)
    {
        console.log(this.event);
        switch (event.type)
        {
            case "keydown":
                // update action dictionary
                mobAction();
                break;
        }
    }
    
    mobAction(action)
    {
        switch (action) {
            case 'Attack':
                // check if attack is valid
                // if yes, combat
                // if not, call method again with next index of action dictionary
                initializeCombat();
                // call weight reset method
                break;
            case 'Move':
                // find any valid, empty tile
                // empty tile is required to not call combat
                // if yes, move to that tile
                // if not, call method again with next index of action dictionary
                this.renderer.setAnimation('animation', this.animationSpeed);
                this.move(Direction.valid);
                // call weight reset method
                break;
            case 'Item':
                // use consumable
                // call weight reset method
                break;
            case 'Wait':
                // do nothing
                // call weight reset method
                break;
        }
    }
}




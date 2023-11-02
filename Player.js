import { Direction, Vector2 } from "./Vectors.js";
import { Item } from "./Item.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
export {Player};

class Player extends Entity
{
    account;
    health;
    inventory;
    Room;

    speed = 32;

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), health=10, account=null)
    {
        super(name, transform, renderer);
        this.account = account;
        this.health = health;
        this.inventory = new Inventory();
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
            //game over
        }
    }
    initializeCombat()
    {
        // call combat
    }
    position(room,tile)
    {
        this.room=room;
        this.tile=tile;
    }
    move(direction)
    {
        var position;
        switch (direction) {
            case value: right
                position = Direction.Right;
            case value: left 
                position = Direction.Left;
            case value: down
                position = Direction.Down;
            case value: up
                position = Direction.Up;
            default: 
                break;
        }
        //check case for wall
        if(position==wall)
        {
            //return original position
        }
        //check case for wall
        if(position==door.room)
        {
            //return new position in new room
        }
        //check case for Mob
        if(position.hasMob())
        {
            //initiate combat then return original position
        }
        else
        {
            //return position
        }
    }
    display()
    {
        //returns character sprite at position
    }
    broadcast(event)
    {
        switch (event.type)
        {
            case "keydown":
                this.playerInput(event.key);
                break;
        }
    }
    playerInput(key)
    {
        switch (key) {
            case 'ArrowUp':
            case 'w':
                this.renderer.updateSprite(PIXI.Texture.from("./images/up.png"));
                this.transform.translate(new Vector2(0, -this.speed));
                break;
            case 'ArrowLeft':
            case 'a':
                this.renderer.updateSprite(PIXI.Texture.from("./images/left.png"));
                this.transform.translate(new Vector2(-this.speed, 0));
                break;
            case 'ArrowDown':
            case 's':
                this.renderer.updateSprite(PIXI.Texture.from("./images/down.png"));
                this.transform.translate(new Vector2(0, this.speed));
                break;
            case 'ArrowRight':
            case 'd':
                this.renderer.updateSprite(PIXI.Texture.from("./images/right.png"));
                this.transform.translate(new Vector2(this.speed, 0));
                break;
            default:
                break;
        }
        console.log(this.transform.position)
    }
}


class Inventory
{
    weapon;
    armor;
    consumables;

    constructor()
    {
        this.weapon = null;
        this.armor = null;
        this.consumables = [];
    }

    /**
     * Stores an item in the inventory. If something needs to be dropped to store, returns an item. 
     * Otherwise, return null;
     * @param {Item} item
     * @returns {Item?} item to drop, if applicable
     */
    store(item)
    {
        if (item.isWeapon())
        {
            var currentWeapon = this.weapon;
            this.weapon = item;
            return currentWeapon;
        }
        else if (item.isArmor())
        {
            var currentArmor = this.armor;
            this.armor = item;
            return currentArmor;
        }
        else if (item.isConsumable())
        {
            var stackableItem = this.consumables.find((e) => e.equals(item));
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
            var index = this.consumables.findIndex((e) => e.equals(item));
            if (index != -1)
            {
                this.consumables.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}
import { Direction, Vector2 } from "./Vectors.js";
import { Item } from "./Item.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
export {Player};

/**
 * Class representing the Player entity
 * 
 * @extends Entity
 */
class Player extends Entity
{
    account;
    health;
    inventory;
    Room;

    cellSize = 32;
    roomSize = 512;

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/6;

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game=undefined, health=10, account=null)
    {
        super(name, transform, renderer, game);

        this.moveTarget = transform.position;

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
    update(delta)
    {
        var difference = Vector2.subtract(this.moveTarget, this.transform.position);
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
        var pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(direction, this.cellSize));

        if (pos.x < 0 || pos.x >= this.roomSize || pos.y < 0 || pos.y >= this.roomSize)
        {
            return;
        }

        this.moveTarget = pos;
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
        if (!this.transform.position.equals(this.moveTarget)) return;

        switch (key) {
            case 'ArrowUp':
            case 'w':
                this.renderer.setAnimation('walkup', this.animationSpeed);
                this.move(Direction.Up);
                break;
            case 'ArrowLeft':
            case 'a':
                this.renderer.setAnimation('walkleft', this.animationSpeed);
                this.move(Direction.Left);
                break;
            case 'ArrowDown':
            case 's':
                this.renderer.setAnimation('walkdown', this.animationSpeed);
                this.move(Direction.Down);
                break;
            case 'ArrowRight':
            case 'd':
                this.renderer.setAnimation('walkright', this.animationSpeed);
                this.move(Direction.Right);
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
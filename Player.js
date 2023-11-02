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
    roomSize = 512;

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
        var pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(direction, this.speed));

        if (pos.x < 0 || pos.x >= this.roomSize || pos.y < 0 || pos.y >= this.roomSize)
        {
            return;
        }

        this.transform.position = pos;

        // //check case for wall
        // if(pos==wall)
        // {
        //     //return original position
        // }
        // //check case for wall
        // if(pos==door.room)
        // {
        //     //return new position in new room
        // }
        // //check case for Mob
        // if(pos.hasMob())
        // {
        //     //initiate combat then return original position
        // }
        // else
        // {
        //     //return position
        // }
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
        //const animations = PIXI.Assets.cache.get('./images/character.json').data.animations;
        //const character = PIXI.AnimatedSprite.fromFrames(animations["playerAnimation/walk"]);

        switch (key) {
            case 'ArrowUp':
            case 'w':
                this.renderer.updateSprite();
                this.renderer.
                this.move(Direction.Up);
                break;
            case 'ArrowLeft':
            case 'a':
                this.renderer.updateSprite(PIXI.Texture.from("./images/left.png"));
                this.move(Direction.Left);
                break;
            case 'ArrowDown':
            case 's':
                this.renderer.updateSprite(PIXI.Texture.from("./images/down.png"));
                this.move(Direction.Down);
                break;
            case 'ArrowRight':
            case 'd':
                this.renderer.updateSprite(PIXI.Texture.from("./images/right.png"));
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
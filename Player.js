import { Direction, Vector2 } from "./Vectors.js";
import { Armor, Consumable, Item, Weapon } from "./Item.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
import { Inventory } from "./Inventory.js";
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
    room;

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game=undefined, health=10, account=null)
    {
        super(name, transform, renderer, game);

        this.moveTarget = transform._Position;

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
        health = health - damageDone;
        if(health < 1)
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
        const difference = Vector2.subtract(this.moveTarget, this._Transform._Position);
        if (difference.getMagnitude() < 0.1)
        {
            this._Transform._Position = this.moveTarget.copy();
        }
        else
        {
            difference.normalize();
            difference.scalarMultiply(this.speed * delta);
            this._Transform.translate(difference);
        }
    }
    move(direction)
    {
        const pos = Vector2.add(this._Transform._Position, Vector2.scalarMultiply(direction, this.game.grid.cellSize));

        const roomWidth = this.game.grid.cellSize * this.game.grid.width;
        const roomHeight = this.game.grid.cellSize * this.game.grid.height;
        if (pos._X < 0 || pos._X >= roomWidth || pos._Y < 0 || pos._Y >= roomHeight)
            return;

        this.moveTarget = pos;
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
        if (!this._Transform._Position.equals(this.moveTarget)) return;

        switch (key) {
            case 'ArrowUp':
            case 'w':
                this._Renderer.setAnimation('walkup', this.animationSpeed);
                this.move(Direction.Up);
                break;
            case 'ArrowLeft':
            case 'a':
                this._Renderer.setAnimation('walkleft', this.animationSpeed);
                this.move(Direction.Left);
                break;
            case 'ArrowDown':
            case 's':
                this._Renderer.setAnimation('walkdown', this.animationSpeed);
                this.move(Direction.Down);
                break;
            case 'ArrowRight':
            case 'd':
                this._Renderer.setAnimation('walkright', this.animationSpeed);
                this.move(Direction.Right);
                break;
            default:
                break;
        }
        console.log(this._Transform._Position);
    }

    serialize()
    {
        return '{ "type":"Player", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    static deserialize(obj, game)
    {
        const p = new Player(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game)
        p.inventory = Inventory.deserialize(obj.inventory);
        return p;
    }
}
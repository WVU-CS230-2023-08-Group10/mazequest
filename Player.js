import { Direction, Vector2 } from "./Vectors.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
import { Inventory } from "./Inventory.js";
import { Collider } from "./LevelElements.js";
import { Enemy } from "./Enemy.js";
import { Combat } from "./Combat.js";
export { Player };

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

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined, health = 10, account = null)
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
        this.health -= damageDone;

        // game over
        if(health <= 0)
        {
            // removing Player from room
            this.destroy();
            alert("You died!");
            
            // unloading room.
            this.game.unloadRoom();
            
            // Resetting rooms.
            this.game.generateRoomLayout();

            // loading default rooms.
            this.game.loadRoom();

            // adding new Player into room.
            this.game.deserializeEntity({"Player":
            {
                "type": "Player", 
                "name": "Player", 
                "transform": 
                { 
                    "position" : { "x" : 256, "y" : 256}, 
                    "scale" : { "x" : 2, "y" : 2}, 
                    "rotation" : 0
                }, 
                "renderer": 
                { 
                    "type":"Renderer", 
                    "spriteSheetInfo": 
                    { 
                        "json":"./images/armor/leatherArmor.json", 
                        "img":"./images/armor/leatherArmor.png"
                    }, 
                    "transform": 
                    { 
                        "position" : { "x" : 0, "y" : 0}, 
                        "scale" : { "x" : 1, "y" : 1}, 
                        "rotation" : 0
                    }, 
                    "animation":"default"
                }, 
                "inventory":
                { 
                    "type":"Inventory", 
                    "weapon":
                    { 
                        "type":"Weapon", 
                        "name":"Starter Sword",
                        "damage": { "low":5, "high":20 },
                        "trace":[ {"x":0, "y":0} , {"x":0, "y":1} , {"x":0, "y":2} , {"x":0, "y":3} ],
                        "renderer": { 
                            "type":"Renderer", 
                            "spriteSheetInfo": { "json":"./images/weapons/sword.json", "img":"./images/weapons/sword.png" }, 
                            "transform" : {
                                "position" : { "x":0, "y":0 },
                                "scale" : { "x":1, "y":1 },
                                "rotation" : 0
                            } 
                        }
                    }, 
                    "armor":null, 
                    "consumables":[]
                }
            }});
        }
    }
    initializeCombat()
    {
        // call combat
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
        const pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(direction, this.game.grid.cellSize));

        const roomWidth = this.game.grid.cellSize * this.game.grid.width;
        const roomHeight = this.game.grid.cellSize * this.game.grid.height;
        if (pos.x < 0 || pos.x >= roomWidth || pos.y < 0 || pos.y >= roomHeight)
        {
            this.game.nextRoom(direction);
            return;
        }

        const collisions = this.game.getEntities((e) => {
            return e.transform.position.equals(pos);
        })
        for (const e of collisions)
        {
            if (e instanceof Collider)
                return;
            
            if (e instanceof Enemy)
            {
                new Combat(this, e, this.game.stage);
                return;
            }
        }

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
    }

    serialize()
    {
        return '{ "type":"Player", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    static deserialize(obj, game)
    {
        const p = new Player(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game)
        p.inventory = Inventory.deserialize(obj.inventory, game);
        return p;
    }
}
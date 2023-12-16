import { Direction, Vector2 } from "./Vectors.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
import { Inventory } from "./Inventory.js";
import { Collider } from "./LevelElements.js";
import { Enemy } from "./Enemy.js";
import { Combat } from "./Combat.js";
import { Mob } from "./Mob.js";
export { Player };

/**
 * Class representing the Player Entity.
 * 
 * Fields:
 *  - account : Account
 *  - health : integer
 *  - inventory : Array
 *  - speed : integer
 *  - moveTarget : Vector
 *  - animationSpeed : double
 * 
 * Methods:
 *  - {@link pickUp} : Updates inventory with new item.
 *  - {@link drop} : Updates Inventory, removes item.
 *  - {@link damage} : Updates health with incoming damage. Calls gameOver function.
 *  - {@link initializeCombat} : Creates new instance of Combat.
 *  - {@link update} : Called by the game object every tick.
 *  - {@link move} : Moves player across canvas, takes into consideration of collisions with walls and other entities.
 *  - {@link broadcast} : How player recieves events.
 *  - {@link playerInput} : Recieves player input through keys
 *  - {@link serialize} : Creates a simplified JSON version of an instance of an Player, keeping only the important information to be used.
 *  - {@link deserialize} : Take an object that has been serialized and turn it into an instance of Player.
 * 
 *  @extends Entity
 */
class Player extends Entity
{
    account;
    health;
    inventory;

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    /**
     * Creates a new player instance that controls the users character on the game canvas.
     * This method requires Inventory usage to account for items  
     * which allows the game to add new graphics to the canvas for rendering.
     * @param {string} name the users name.
     * @param {transform} transform Player position, scale, and rotation.
     * @param {renderer} renderer Player renderer.
     * @param {game} game The Game this is attached to (if any).
     * @param {integer} health Initial health of the user.
     * @param {account} account Account of the user.
     */
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined, health = 10, account = null)
    {
        super(name, transform, renderer, game);

        this.moveTarget = transform._Position;

        this.account = account;
        this.health = health;
        this.inventory = new Inventory();
        
    }
    /**
     * Accesses Inventory, and updates items.
     * @param {item} item new item that is added to inventory.
     */
    pickUp(item)
    {
        this.inventory.store(item);
    }
     /**
     * Accesses Inventory, and updates items.
     * @param {item} item item that is deleted from inventory.
     */
    drop(item)
    {
        this.inventory.drop(item);
    }
    /**
     * Updates Health based on damage done, then calls gameOver function if health is depleted.
     * @param {integer} damageDone integer that is subtracted from health.
     */
    damage(damageDone)
    {
        this.health -= damageDone;
        

        // game over
        if(this.health <= 0)
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
            this.game.deserializeEntity({
                type: "Player", 
                name: "Player", 
                transform: 
                { 
                    position : { x : 256, y : 256}, 
                    scale : { x : 2, y : 2}, 
                    rotation : 0
                }, 
                renderer: 
                { 
                    type:"Renderer", 
                    spriteSheetInfo: 
                    { 
                        json:"./images/armor/leatherArmor.json", 
                        img:"./images/armor/leatherArmor.png"
                    }, 
                    transform: 
                    { 
                        position : { x : 0, y : 0}, 
                        scale : { x : 1, y : 1}, 
                        rotation : 0
                    }, 
                    animation:"default"
                }, 
                inventory:
                { 
                    type:"Inventory", 
                    weapon:
                    { 
                        type:"Weapon", 
                        name:"Starter Sword",
                        damage: { low:5, high:20 },
                        trace:[ {x:0, y:0} , {x:0, y:1} , {x:0, y:2} , {x:0, y:3} ],
                        renderer: { 
                            type:"Renderer", 
                            spriteSheetInfo: { json:"./images/weapons/sword.json", img:"./images/weapons/sword.png" }, 
                            transform : {
                                position : { x:0, y:0 },
                                scale : { x:1, y:1 },
                                rotation : 0
                            } 
                        }
                    }, 
                    armor:"null", 
                    consumables:[]
                }
            });
        }
    }
    /**
     * Calls new instance of Combat.
     */
    initializeCombat()
    {
        return new Combat;
    }
    /**
     * Called by the game object every tick.
     * @param {number} delta amount of time between ticks.
     */
    update(delta)
    {
        if (this.inventory.weapon != null)
        {
            this.inventory.weapon.transform.position = new Vector2(544, 432);
            this.inventory.weapon.transform.scale = new Vector2(4, 4);
        }
        if (this.inventory.armor != null)
        {
            this.inventory.armor.transform.position = new Vector2(544, 326);
            this.inventory.weapon.transform.scale = new Vector2(4, 4);
        }

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
    /**
     * Moves player across canvas, takes into consideration of collisions with walls and other entities
     * @param {direction} direction indicates the direction that player object must move.
     */
    move(direction)
    {
        const pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(direction, this.game.grid.cellSize));

        const roomWidth = this.game.grid.cellSize * this.game.grid.width;
        const roomHeight = this.game.grid.cellSize * this.game.grid.height;
        if (pos.x < 0 || pos.x >= roomWidth || pos.y < 0 || pos.y >= roomHeight)
        {
            // Go to the next room
            this.game.nextRoom(direction);
            // Wrap player position
            if (pos.x < 0)
            {
                this.transform.position.x = roomWidth-32;
                this.transform.position.y = roomHeight/2;
            }
            else if (pos.x >= roomWidth)
            {
                this.transform.position.x = 0;
                this.transform.position.y = roomHeight/2;
            }
            else if (pos.y < 0)
            {
                this.transform.position.y = roomHeight-32;
                this.transform.position.x = roomWidth/2;
            }
            else if (pos.y >= roomHeight)
            {
                this.transform.position.y = 0;
                this.transform.position.x = roomWidth/2;
            }
            this.moveTarget = this.transform.position;
            return;
        }

        const collisions = this.game.getEntities((e) => {
            if (e instanceof Player || e instanceof Mob)
                return e.moveTarget.equals(pos);

            return e.transform.position.equals(pos);
        });
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
    /**
     * How player recieves events.
     * @param {event} event the event being passed to the player.
     */
    broadcast(event)
    {
        switch (event.type)
        {
            case "keydown":
                this.playerInput(event.key);
                break;
        }
    }
    /**
     * Takes into account different key inputs from the user and calls the appropriate move functions to control the characters movement.
     * @param {key} key indicates the key that was pressed.
     */
    playerInput(key)
    {
        if (!this.transform.position.equals(this.moveTarget)) return;

        switch (key) {
            case 'ArrowUp':
            case 'w':
                this.renderer.setAnimation('walkup', this.animationSpeed);
                this.move(Direction.Up);
                this.game.broadcastToEntities({ type : "player_action" });
                break;
            case 'ArrowLeft':
            case 'a':
                this.renderer.setAnimation('walkleft', this.animationSpeed);
                this.move(Direction.Left);
                this.game.broadcastToEntities({ type : "player_action" });
                break;
            case 'ArrowDown':
            case 's':
                this.renderer.setAnimation('walkdown', this.animationSpeed);
                this.move(Direction.Down);
                this.game.broadcastToEntities({ type : "player_action" });
                break;
            case 'ArrowRight':
            case 'd':
                this.renderer.setAnimation('walkright', this.animationSpeed);
                this.move(Direction.Right);
                this.game.broadcastToEntities({ type : "player_action" });
                break;
            case ' ':
            case 'z':
                this.game.broadcastToEntities({ type : "player_action" });
                break;
            default:
                break;
        }
    }
    /**
     * Creates a simplified JSON version of an instance of an Player, keeping only the important information to be used.
     * @returns - returns the serialized Player as a string.
     */
    serialize()
    {
        return '{ "type":"Player", "name": "' + this.name + '", "transform": ' + this.transform.serialize() + ', "renderer": '
            + this.renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }
    /**
     * Take an object that has been serialized and turn it into an instance of Player.
     * @param {*} obj - object to deserialize.
     * @param {*} game - instance of game used to derserialize the fields into usable fields.
     * @returns - returns new instance of Player with intialized fields if applicable.
     */
    static deserialize(obj, game)
    {
        const p = new Player(obj.name, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game)
        p.inventory = Inventory.deserialize(obj.inventory, game);
        return p;
    }
}
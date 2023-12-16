import { Direction, Vector2 } from "./Vectors.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
import { Inventory } from "./Inventory.js";
import { Collider } from "./LevelElements.js";
import { Enemy } from "./Enemy.js";
import { PriorityList, Action } from "./PriorityList.js";
import { Combat } from "./Combat.js";
import { Player } from "./Player.js";

export {Mob};

/**
 * Class representing generic entities
 * 
 * Fields: 
 *  - mobName : String
 *  - mobHealth : integer
 *  - inventory : ({@link Inventory}) Array
 *  - mobHostile : Boolean
 *  - speed : integer
 *  - moveTarget : ({@link Vector2}) Vector
 *  - animationSpeed : double
 *  - actionDict : ({@link PriorityList}) PriorityList
 * 
 * Methods:
 *  - {@link isEnemy} : Checks if a Mob is an Enemy.
 *  - {@link isNPC} : Checks if an Mob is an NPC.
 *  - {@link equals} : Checks if two Mobs are the same.
 *  - {@link pickUp} : Updates inventory with new item. 
 *  - {@link drop} : Updates Inventory, removes item.
 *  - {@link damage} : Updates health with incoming damage. Calls gameOver function.
 *  - {@link initializeCombat} : Creates new instance of Combat.
 *  - {@link update} : Called by the game object every tick.
 *  - {@link move} : Moves player across canvas, takes into consideration of collisions with walls and other entities.
 *  - {@link updateAction} : How mob updates its behavior.
 *  - {@link broadcast} : How Mob recieves events.
 *  - {@link mobAction} : Determines Mob actions for movement, attacking and items.
 *  - {@link serialize} : Creates a simplified JSON version of an instance of an Player, keeping only the important information to be used.
 *  - {@link deserialize} : Take an object that has been serialized and turn it into an instance of Player.
 *
 *  @extends Entity 
*/
class Mob extends Entity
{
    mobName;
    mobHealth;
    inventory;
    mobHostile;

    speed = 2;
    moveTarget = new Vector2(0, 0);
    animationSpeed = 1/6;

    actionDict = new PriorityList();

    /**
     * Creates a new mob instance on the game canvas.
     * This method requires Inventory usage to account for items  
     * which allows the game to add new graphics to the canvas for rendering.
     * @param {string} name the mobs name.
     * @param {transform} transform Mob position, scale, and rotation.
     * @param {renderer} renderer Mob renderer.
     * @param {game} game The Game this is attached to (if any).
     * @param {integer} health Initial health of the mob.
     * @param {boolean} hostile Default orientation of mob.
     * @param {PriorityList} AIDict Default behavior of mob.
     */
    constructor(name = "", transform = new Transform(), renderer = new Renderer(), game = undefined, health = 1, hostile = undefined, AIDict = new PriorityList([new Action("Move", 1, 1, 1)])) {
        
        super(name, transform, renderer, game);
        
        this.mobName = name;
        this.mobHealth = health;
        this.inventory = new Inventory();
        this.mobHostile = hostile;
        this.actionDict = AIDict;

        this.moveTarget = this.transform.position;
    }
    /**
     * Checks if Mob is an instance of Enemy.
     * @param {Mob} Mob Mob to be checked.
     */
    isEnemy(Mob) 
    {
        return Mob instanceof Enemy;
    }
    /**
     * Checks if Mob is an instance of NPC.
     * @param {Mob} Mob Mob to be checked.
     */
    isNPC(Mob) 
    {
        return Mob instanceof NPC;
    }
    /**
     * Checks if two instances of mob have the same name.
     * @param {Object} obj Mob to be checked.
     */
    equals(obj)
    {
        if (!(obj instanceof Mob))
            return false;

        if (this.mobName == obj.mobName)
            return true;
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
     * Updates Health based on damage done, then calls destroy function if health is depleted.
     * @param {integer} damageDone integer that is subtracted from health.
     */
    damage(damageDone)
    {
        this.health -= damageDone;
        if(health <= 0)
        {
            this.destroy();
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
        const difference = Vector2.subtract(this.moveTarget, this.transform.position);
        if (difference.getMagnitude() < 1)
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
     * Moves mob across canvas, takes into consideration of collisions with walls and other entities
     * @param {direction} direction indicates the direction that mob object must move.
     */
    move(direction)
    {
        const pos = Vector2.add(this.moveTarget, Vector2.scalarMultiply(direction, this.game.grid.cellSize));

        const roomWidth = this.game.grid.cellSize * this.game.grid.width;
        const roomHeight = this.game.grid.cellSize * this.game.grid.height;
        if (pos.x < 0 || pos.x >= roomWidth || pos.y < 0 || pos.y >= roomHeight)
        {
            return;
        }

        this.moveTarget = pos;
    }
    /**
     * How mobs updates their behavior.
     */
    updateAction() {
        for (let i = 0; i < this.AIDict.size(); i++) {
            this.AIDict[i].addPriority();
        }
    }
    /**
     * How mob registers that the player has been passed an event and acts according to its behavior.
     * @param {event} event the event being passed to the player.
     */
    broadcast(event)
    {
        switch (event.type)
        {
            case "player_action":
                this.actionDict.addPriority();
                this.mobAction()
                break;
        }
    }
    /**
     * How mob calls the appropriate functions according to its behavior to control its actions.
     */
    mobAction()
    {
        const action = this.actionDict.getPriorityAction().name;
        this.actionDict.resetPriority();
        switch (action) {
            case 'Attack':
                // checks if attack has valid target.
                // if yes, attacks.
                // if not, calls method again with updated priority.
                initializeCombat();
                break;
            case 'Move':
                
                let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
                let validMoves = [];
                for (const dir of directions)
                {
                    let isValid = true;
                    const pos = Vector2.add(this.moveTarget, Vector2.scalarMultiply(dir, this.game.grid.cellSize));

                    // Get collisions for the given direction
                    const collisions = this.game.getEntities((e) => {
                        if (e instanceof Player || e instanceof Mob)
                            return e.moveTarget.equals(pos);

                        return e.transform.position.equals(pos);
                    });
                    for (const e of collisions)
                    {
                        // If move would colide with player, wall, or other mob, the move is not valid
                        if (e instanceof Collider || e instanceof Player || e instanceof Mob)
                            isValid = false;
                    }
                    if (isValid)
                    {
                        validMoves.push(dir.copy());
                    }
                }
                // If no valid tiles...
                if (validMoves.length <= 0)
                {
                    // ...retry action
                    this.mobAction();
                    break;
                }

                // Pick a random valid move
                const i = Math.floor(Math.random() * validMoves.length);
                const move = validMoves[i];
                // Change animation
                if (move.equals(Direction.Up)) {
                    this.renderer.setAnimation('walkup', this.animationSpeed);
                }
                else if (move.equals(Direction.Down)) {
                    this.renderer.setAnimation('walkdown', this.animationSpeed);
                }
                else if (move.equals(Direction.Left)) {
                    this.renderer.setAnimation('walkleft', this.animationSpeed);
                }
                else if (move.equals(Direction.Right)) {
                    this.renderer.setAnimation('walkright', this.animationSpeed);
                }
                // Move in the direction
                this.move(move);
                break;
            case 'Item':
                // use consumable
                break;
            case 'Wait':
                break;
            default:
                break;
        }
    }

    /**
     * Creates a simplified JSON version of an instance of a mob, keeping only the important information to be used.
     * @returns - returns the serialized mob as a string.
     */
    serialize()
    {
        return '{ "type":"Mob", "name": "' + this._Name + '", "transform": ' + this._Transform.serialize() + ', "renderer": '
            + this._Renderer.serialize() + ', "inventory":' + this.inventory.serialize() + '}';
    }

    /**
     * Take an object that has been serialized and turn it into an instance of mob.
     * @param {*} obj - object to deserialize.
     * @param {*} game - instance of game used to derserialize the fields into usable fields.
     * @returns - returns new instance of mob with intialized fields if applicable.
     */
    static deserialize(obj, game)
    {
        const p = new Mob(obj.mobName, Transform.deserialize(obj.transform), Renderer.deserialize(obj.renderer, game.stage), game)
        p.inventory = Inventory.deserialize(obj.inventory, game);
        return p;
   
    }
}
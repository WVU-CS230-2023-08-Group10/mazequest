import { Direction, Vector2 } from "./Vectors.js";
import { Armor, Consumable, Item, Weapon } from "./Item.js";
import { Inventory } from "./Inventory.js";
import { Transform } from "./Transform.js";
import { Renderer } from "./Renderer.js";
import { Entity } from "./Entity.js";
// import { actions } from "./PriorityList.js";

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
    inventory;
    mobHostile;

    speed = 2;
    moveTarget = new Vector2(0.0, 0.0);
    animationSpeed = 1/3;

    actionDict = new PriorityList();

    constructor(name, health, hostile, AIDict, transform = new Transform(), renderer = new Renderer(), game = undefined) {
        
        super(name, transform, renderer, game);
        
        this.mobName = name;
        this.mobHealth = health;
        this.inventory = new Inventory();
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
        return this.inventory;
    }

    set setInventory(inventory) 
    {
        this.inventory = inventory;
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
            return;
        }

        this.moveTarget = pos;
    }

    updateAction() {
        for (let i = 0; i < this.AIDict.size(); i++) {
            this.AIDict[i].addPriority();
        }
    }

    broadcast(event)
    {
        console.log(this.event);
        switch (event.type)
        {
            case "keydown":
                this.actionDict.addPriority();
                this.mobAction()
                break;
        }
    }

    mobAction()
    {
        const action = this.actionDict.getPriorityAction().name;
        this.actionDict.resetPriority();
        switch (action) {
            case 'Attack':
                
                // check if attack is valid
                // if yes, combat
                // if not, call method again with next index of action dictionary
                initializeCombat();
                break;
            case 'Move':
                // Get valid directions to move
                let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
                let validMoves = [];
                for (const dir in directions)
                {
                    const isValid = true;
                    const pos = Vector2.add(this.transform.position, Vector2.scalarMultiply(dir, this.game.grid.cellSize));
                    // Get collisions for the given direction
                    const collisions = this.game.getEntities((e) => {
                        return e.transform.position.equals(pos);
                    });
                    for (const e of collisions)
                    {
                        // If move would colide with player, wall, or other mob, the move is not valid
                        if (e instanceof Collider || e instanceof Player || e instanceof Mob)
                            isValid = false;
                    }
                    if (isValid)
                        validMoves.push(dir);
                }
                // If no valid tiles...
                if (validMoves.length <= 0)
                {
                    // ...retry action
                    this.mobAction();
                    break;
                }

                // Pick a random valid move
                const i = floor(Math.random() * (validMoves.length - 1));
                // Change animation
                if (validMoves[i].equals(Direction.Up)) {
                    this.renderer.setAnimation('walkup', this.animationSpeed);
                }
                else if (validMoves[i].equals(Direction.Down)) {
                    this.renderer.setAnimation('walkdown', this.animationSpeed);
                }
                else if (validMoves[i].equals(Direction.Left)) {
                    this.renderer.setAnimation('walkleft', this.animationSpeed);
                }
                else if (validMoves[i].equals(Direction.Right)) {
                    this.renderer.setAnimation('walkright', this.animationSpeed);
                }
                // Move in the direction
                this.move(Vector2.scalarMultiply(validMoves[i], this.game.grid.cellSize));
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
}
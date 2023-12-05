import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { Vector2 } from "./Vectors.js";
import { Renderer } from "./Renderer.js";
import { Player } from "./Player.js";
import { Weapon, Armor, Consumable } from "./Item.js";
import { Collider } from "./LevelElements.js";
import { Enemy } from "./Enemy.js";
export {Game};

/**
 * Class representing the game manager.
 * 
 * Useful methods to know:
 *  - {@link registerEntity} : Required for entities to recieve updates.
 *  - {@link updateEntities} : Updates registered entities and their renderers.
 *  - {@link broadcastToEntities} : Broadcasts an event to all registered entities.
 *  - {@link getEntity} : Gets an entity by name.
 *  - {@link getEntities} : Gets a list of entities by name.
 *  - {@link serializeGameState} : Makes a JSON string to represent the current game state.
 *  - {@link deserializeGameState} : Loads a previously saved game state.
 */
class Game
{
    entityList;
    stage;
    isInEditMode;
    grid;

    /**
     * Creates a new game manager instance that handles the top level game functions.
     * This method requires a {@link PIXI.Container} (likely from the pixi Application) 
     * which allows the game to add new graphics to the canvas for rendering.
     * @param {Container} stage The application stage for the game to run on
     */
    constructor(stage) 
    {
        this.entityList = [];
        this.stage = stage;

        this.grid = {
            cellSize: 32,
            width: 16,
            height: 16
        }

        // var playerSpriteInfo = { json: './images/armor/leatherArmor.json', img:'./images/armor/leatherArmor.png'};
        // var player = new Player("Player", new Transform(new Vector2(256, 256), new Vector2(2, 2)), new Renderer(playerSpriteInfo, stage), this)
        // this.registerEntity(player);

        // console.log(this.getEntity("Player").serialize());
    }

    /**
     * Adds an entity to the registry. Must be done for the entity to recieve {@link Entity.update|update()}, 
     * {@link Entity.render|render()}, and {@link Entity.broadcast|broadcast()} calls.
     * @param {Entity} entity Entity to be added.
     */
    registerEntity(entity)
    {
        this.entityList.push(entity);
    }

    /**
     * Removes an entity from the registry. This only prevents {@link Entity.update|update()}, 
     * {@link Entity.render|render()}, and {@link Entity.broadcast|broadcast()} calls from reaching the entity, but will
     * not delete the entity or remove it from the canvas.
     * @param {Entity} entity The entity to unregister
     */
    unregisterEntity(entity)
    {
        const i = this.entityList.indexOf(entity);
        this.entityList.splice(i, 1);
    }

    /**
     * Calls {@link Entity.update|update()} and {@link Entity.render|render()} on all entities in the registry.
     * @param {Number} delta Should theoretically be the time elapsed since the last update call
     */
    updateEntities(delta)
    {
        for (const entity of this.entityList) {
            entity.update(delta);
            entity.render(delta);
        }
    }

    /**
     * Similar to {@link updateEntities}, except it only calls {@link Entity.render|render()} on all entities in the 
     * registry.
     * @param {Number} delta Should theoretically be the time elapsed since the last render call
     */
    renderEntities(delta)
    {
        for (const entity of this.entityList) {
            entity.render(delta);
        }
    }

    /**
     * Relays an event to all entities in the registry via their {@link Entity.broadcast|broadcast()} method.
     * @param {object} event Event to relay. Should be a structure containing at minimum a type variable.
     */
    broadcastToEntities(event)
    {
        for (const entity of this.entityList) {
            entity.broadcast(event);
        }
    }

    /**
     * Finds and returns the first entity in the registry that fulfills the given predicate.
     * @param {Predicate} predicate Function that takes an {@link Entity} and returns a {@link Boolean}
     * @returns The first registered entity that meets the predicate
     */
    getEntity(predicate)
    {
        for (const entity of this.entityList)
        {
            if (predicate(entity))
                return entity;
        }
        return null;
    }

    /**
     * Returns whether an entity in the registry fulfills the given predicate.
     * @param {Predicate} predicate Function that takes an {@link Entity} and returns a {@link Boolean}
     * @returns Whether an entity was found
     */
    entityExists(predicate)
    {
        return (this.getEntity(predicate) != null);
    }

    /**
     * Finds and returns an array of Entities in the registry that fulfill the given predicate.
     * @param {Predicate} predicate Function that takes an {@link Entity} and returns a {@link Boolean}
     * @returns {Array<Entity>} A list of the registered entities that meet the predicate
     */
    getEntities(predicate)
    {
        var output = [];
        for (const entity of this.entityList)
        {
            if (predicate(entity))
                output.push(entity);
        }
        return output;
    }

    /**
     * Serializes all entities in the registry, returning them as a stringified JSON array.
     * @returns {String} A JSON array as a string
     */
    serializeGameState()
    {
        var str = "[";
        for (var i = 0; i < this.entityList.length; i++)
        {
            const e = this.entityList[i];
            str += e.serialize();
            if (i == this.entityList.length-1)
                str += ", ";
        }
        str += "]";
        return str;
    }

    saveRoom()
    {
        var roomId = 0;

        return {
            username : "user",
            level_file : this.serializeGameState(),
            index : roomId
        };
    }

    /**
     * Constructs a new entity registry from a provided game state string. The game state string should
     * probably be constructed via {@link serializeGameState}. If constructed otherwise, ensure that the
     * string represents a JSON array of deserializable {@link Entity} objects.
     * 
     * Note: The registry is cleared to load the game state. Clean up is not handled in this step, but it
     * insures the registry is empty. You absolutely should properly dispose of all entities before calling this method.
     * @param {String} str A serialized Game state string.
     */
    deserializeGameState(str)
    {
        this.entityList = [];
        var json = JSON.parse(str);
        for (var o of json)
        {
            this.deserializeEntity(o);
        }
    }

    /**
     * Deserializes a JSON object, creating the respective entity. The JSON Object must be a representation of
     * an object extending {@link Entity}.
     * 
     * @param {Object} obj Object to deserialize.
     */
    deserializeEntity(obj)
    {
        let e;
        switch (obj.type)
        {
            case "Player":
                e = Player.deserialize(obj, this);
                break;
            case "Weapon":
                e = Weapon.deserialize(obj, this);
                break;
            case "Armor":
                e = Armor.deserialize(obj, this);
                break;
            case "Consumable":
                e = Consumable.deserialize(obj, this);
                break;
            case "Collider":
                e = Collider.deserialize(obj, this);
                break;
            case "Enemy":
                e = Enemy.deserialize(obj, this);
                break;
        }
        this.registerEntity(e);
        return e;
    }
}
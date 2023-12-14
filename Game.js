import { Entity } from "./Entity.js";
import { Vector2 } from "./Vectors.js";
import { Player } from "./Player.js";
import { Weapon, Armor, Consumable } from "./Item.js";
import { Collider, ExitIndicator } from "./LevelElements.js";
import { Enemy } from "./Enemy.js";
import { MazeLayout, GenerationParameters } from "./MazeLayout.js";
export {Game};

/**
 * Class representing the game manager.
 * 
 * Fields:
 *  - currentRoomPosition ({@link Vector2}) : the coordinates in the layout of the currently rendered room
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
    layout;
    currentRoomPosition;
    needsInitialization = true;

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

        this.generateRoomLayout()
    }

    get currentRoom()
    {
        return this.layout.roomArray[currentRoomPosition.y][currentRoomPosition.x];
    }

    /**
     * Generates a new maze layout for the game
     */
    generateRoomLayout()
    {
        this.layout = new MazeLayout(new GenerationParameters(10, 10, 16, 64, .5));
        this.currentRoomPosition = this.layout.startPosition;
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
        if (this.needsInitialization)
        {
            this.needsInitialization = false;
        }

        for (const entity of this.entityList) {
            entity.update(delta);
        }
        // Seperate these into two different loops so that if update changes
        // what entities are registered, we don't get conflicts.
        for (const entity of this.entityList) {
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
            if (i != this.entityList.length-1)
                str += ", ";
        }
        str += "]";
        return str;
    }

    saveRoom()
    {
        var roomId = 0;
        // Based on what exit indicators exist in the room, determine its index/shape
        if (this.entityExists((e) => { return e.renderer.getAnimation() == "exitUp"; })) {
            roomId += 1;
        }
        if (this.entityExists((e) => { return e.renderer.getAnimation() == "exitRight"; })) {
            roomId += 2;
        }
        if (this.entityExists((e) => { return e.renderer.getAnimation() == "exitDown"; })) {
            roomId += 4;
        }
        if (this.entityExists((e) => { return e.renderer.getAnimation() == "exitLeft"; })) {
            roomId += 8;
        }

        return {
            level_file : this.serializeGameState(),
            index : roomId
        };
    }

    /**
     * Moves to the next room in the given direction.
     * 
     * @param {Vector2} direction 
     */
    nextRoom(direction)
    {
        this.currentRoomPosition.add(direction);
        unloadRoom();
        loadRoom();
    }

    /**
     * Deletes all non-player entities from the game.
     */
    unloadRoom()
    {
        // Get all non-player entities
        const entities = this.getEntities((e) => { return !(e instanceof Player); });
        // Delete those entites (consquently unregistering them)
        for (const e of entities)
        {
            e.destroy();
        }
    }

    /**
     * Loads the room given by currentRoomPosition. This DOES NOT unload existing entities.
     * Be sure to use with {@link unloadRoom} if you want to also remove existing non-player
     * entities before loading a new room.
     */
    loadRoom()
    {
        deserializeGameState(this.currentRoom);
    }

    /**
     * Adds entities from a provided game state object. The game state object should
     * probably be constructed via {@link serializeGameState}. If constructed otherwise, ensure that the
     * object represents a JSON array of deserializable {@link Entity} objects.
     * 
     * Note: The registry is not cleared to load the game state, and will simply add the entities to the registry.
     * 
     * @param {Array} json A serialized Game state object (an array of serialized Entities)
     */
    deserializeGameState(json)
    {
        for (const o of json)
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
            case "ExitIndicator":
                e = ExitIndicator.deserialize(obj, this);
                break;
            case "Entity":
                e = ExitIndicator.deserialize(obj, this);
                break;
            default:
                console.log("Entity of type: '" + obj.type + "' not recognized!" );
                break;
        }
        this.registerEntity(e);
        return e;
    }
}
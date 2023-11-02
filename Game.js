import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { Vector2 } from "./Vectors.js";
import { Renderer } from "./Renderer.js";
import { Player } from "./Player.js";
export {Game};

class Game
{
    entityList;
    stage;

    constructor(stage) 
    {
        this.entityList = [];
        this.stage = stage;

        this.registerEntity(new Player("Player", new Transform(new Vector2(256, 256)), 
            new Renderer(PIXI.Texture.from('./images/down.png'), stage)));
    }

    registerEntity(entity)
    {
        this.entityList.push(entity);
    }

    updateEntities(delta)
    {
        for (const entity of this.entityList) {
            entity.update(delta);
            entity.render();
        }
    }

    broadcastToEntities(event)
    {
        for (const entity of this.entityList) {
            entity.broadcast(event);
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns The first registered entity with the given name
     */
    getEntity(name)
    {
        for (const entity in this.entities)
        {
            if (entity.name == name)
                return entity;
        }
    }
}
import { Entity } from "./Entity";
import { Transform } from "./Transform";
import { Vector2 } from "./Vectors";
import { Renderer } from "./Renderer";
export {Game};

class Game
{
    entityList;
    stage;

    constructor(stage) 
    {
        this.entityList = [];
        this.stage = stage;

        this.registerEntity(new Entity("Player", new Transform(new Vector2(256, 256)), 
            new Renderer(PIXI.Texture.from('./images/down.png'), stage)));
    }

    registerEntity(entity)
    {
        this.entityList.push(entity);
    }

    updateEntities()
    {
        for (const entity in this.entities) 
        {
            entity.update();
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns THe first registered entity with the given name
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
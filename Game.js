import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { Vector2 } from "./Vectors.js";
import { Renderer } from "./Renderer.js";
import { Player } from "./Player.js";
export {Game};

const data = await PIXI.Assets.load('./images/playerAnimation.json');
const playerSheet = new PIXI.Spritesheet(PIXI.Texture.from('./images/playerAnimation.png'), data.data);
await playerSheet.parse();

class Game
{
    entityList;
    stage;

    constructor(stage) 
    {
        this.entityList = [];
        this.stage = stage;

        var sprite = new PIXI.AnimatedSprite(playerSheet.animations['default']);
        this.registerEntity(new Player("Player", new Transform(new Vector2(256, 256)), 
            new Renderer(sprite, stage)));
    }

    registerEntity(entity)
    {
        this.entityList.push(entity);
    }

    updateEntities(delta)
    {
        for (const entity of this.entityList) {
            entity.update(delta);
            entity.render(delta);
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
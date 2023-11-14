import { Transform } from "./Transform.js";
export {Renderer};

/**
 * 
 */
class Renderer
{
    transform;
    sprite;
    spriteSheet;
    spriteSheetInfo;
    currentAnimation;
    stage;

    /**
     * Constructs a new Renderer on the provided staage, with the provided spriteSheetInfo.
     * 
     * @param {Object} spriteSheetInfo An object with a "json" key and a "img" key, providing the animation
     * and frame data and the base texture, respectively.
     * @param {Stage} stage PIXI.Stage to be rendered to.
     * @param {Transform} transform Transform defining position, rotation, and scale of the sprite.
     */
    constructor(spriteSheetInfo, stage, transform = new Transform())
    {
        this.initialize(spriteSheetInfo, stage, transform);
    }

    initialize(spriteSheetInfo, stage, transform = new Transform())
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');
        
        this.stage = stage;
        this.transform = transform;
        this.updateSpriteSheet(spriteSheetInfo).then(() => {
            this.setAnimation('default');
            this.sprite.textures[0].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.link();
        });
    }
    
    /**
     * Links this renderer to the stage. This will allow the sprite to be rendered to the canvas
     */
    link()
    {
        this.stage.addChild(this.sprite);
    }
    /**
     * Unlinks the renderer from the stage, removing it from the render cycle.
     */
    unlink()
    {
        this.stage.removeChild(this.sprite);
    }
    dispose()
    {
        if (this.sprite == undefined) return;

        this.unlink();
        this.sprite.destroy(true);
    }
    /**
     * So long as all your animations and frames are contained on a single sheet, you should be able
     * to avoid using this method.
     * @param {Object} spriteSheetInfo An object with a "json" key and a "img" key, providing the animation
     * and frame data and the base texture, respectively.
     */
    async updateSpriteSheet(spriteSheetInfo)
    {
        this.spriteSheetInfo = spriteSheetInfo;
        var data = await PIXI.Assets.load(spriteSheetInfo.json);
        this.spriteSheet = new PIXI.Spritesheet(PIXI.Texture.from(spriteSheetInfo.img), data.data);
        await this.spriteSheet.parse();
    }
    /**
     * Changes the animation of this Renderer. The animation must be defined by the current sprite
     * sheet json structure.
     * @param {String} animationId The name of the animation to play
     * @param {number} speed The animation speed. Defaults to 1
     * @param {boolean} loop Whether the animation should loop. Defaults to false
     */
    setAnimation(animationId, speed=1, loop=false)
    {
        this.currentAnimation = animationId;
        this.unlink();
        this.sprite = new PIXI.AnimatedSprite(this.spriteSheet.animations[animationId]);
        this.link();
        this.sprite.loop = loop;
        this.sprite.animationSpeed = speed;
        this.sprite.play();
        console.log("Successfully changed animation to "+animationId);
    }
    update(delta)
    {
        if (this.sprite == undefined) return;

        var t = this.transform;
        this.sprite.setTransform(t.position.x, t.position.y, t.scale.x, t.scale.y, t.rotation);
    }

    serialize()
    {
        return '{ "type":"Renderer", "spriteSheetInfo": { "json":"' + this.spriteSheetInfo.json +
         '", "img":"'+this.spriteSheetInfo.img+'"}, "transform": ' + this.transform.serialize() + '}';
    }

    static deserialize(obj, stage)
    {
        return new Renderer(obj.spriteSheetInfo, stage, Transform.deserialize(obj.transform));
    }
}
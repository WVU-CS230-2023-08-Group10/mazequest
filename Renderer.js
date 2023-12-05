import { Transform } from "./Transform.js";
export {Renderer};

/**
 * Class representing a Renderer object, which draws sprites to the game canvas.
 * 
 * Fields:
 * No fields are exposed by the Renderer.
 * 
 * Methods:
 * - getAnimation() : Returns the animation name of the current animation
 * - updateSpriteSheet(spriteSheetInfo) : Changes the current sprite information
 */
class Renderer
{
    _SpriteSheetInfo;
    _CurrentAnimation;

    transform;
    sprite;
    spriteSheet;
    stage;

    /**
     * Constructs a new Renderer on the provided staage, with the provided spriteSheetInfo.
     * 
     * @param {Object} spriteSheetInfo An object with a "_Json" key and a "_Img" key, providing the animation
     * and frame data and the base texture, respectively.
     * @param {Stage} stage PIXI.Stage to be rendered to.
     * @param {Transform} transform Transform defining position, rotation, and scale of the sprite.
     */
    constructor(spriteSheetInfo, stage, transform = new Transform(), animation='default')
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');
        
        this.stage = stage;
        this.transform = transform;
        this.updateSpriteSheet(spriteSheetInfo).then(() => {
            this.setAnimation(animation);
            this.sprite.textures[0].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.link();
        });
    }

    getAnimation()
    {
        return this._CurrentAnimation;
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
    /**
     * Unlinks and destroys the sprite associated with this renderer.
     */
    dispose()
    {
        if (this.sprite == undefined) return;

        this.unlink();
        this.sprite.destroy(true);
    }
    /**
     * So long as all your animations and frames are contained on a single sheet, you should be able
     * to avoid using this method.
     * 
     * If you use this without also changing the animation (changing to "default" should always work), the
     * animation may end up referencing a non-existent animation.
     * 
     * @param {Object} spriteSheetInfo An object with a "_Json" key and a "_Img" key, providing the animation
     * and frame data and the base texture, respectively.
     */
    async updateSpriteSheet(spriteSheetInfo)
    {
        this._SpriteSheetInfo = spriteSheetInfo;
        var data = await PIXI.Assets.load(spriteSheetInfo._Json);
        this.spriteSheet = new PIXI.Spritesheet(PIXI.Texture.from(spriteSheetInfo._Img), data.data);
        await this.spriteSheet.parse();
    }
    /**
     * Changes the animation of this Renderer. The animation must be defined by the current sprite
     * sheet json structure.
     * 
     * @param {String} animationId The name of the animation to play
     * @param {number} speed The animation speed. Defaults to 1
     * @param {boolean} loop Whether the animation should loop. Defaults to false
     */
    setAnimation(animationId, speed=1, loop=false)
    {
        let anim;
        try {
            anim = this.spriteSheet.animations[animationId];
        } catch {
            throw new Error("Trying to change a renderer's animation, but the animation does not exist.");
        }

        this._CurrentAnimation = animationId;
        this.unlink();
        this.sprite = new PIXI.AnimatedSprite(anim);
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
        this.sprite.setTransform(t._Position._X, t._Position._Y, t._Scale._X, t._Scale._Y, t._Rotation);
    }

    serialize()
    {
        return '{ "type":"Renderer", "spriteSheetInfo": { json":"' + this._SpriteSheetInfo._Json +
         '", "img":"'+this._SpriteSheetInfo._Img+'"}, "transform": ' + this.transform.serialize() + 
         '"animation": '+this.getAnimation()+'}';
    }

    static deserialize(obj, stage)
    {
        return new Renderer(
            {
                _Json : obj.spriteSheetInfo.json,
                _Img : obj.spriteSheetInfo.img
            }, 
            stage,
            Transform.deserialize(obj.transform), 
            obj.animation
        );
    }
}
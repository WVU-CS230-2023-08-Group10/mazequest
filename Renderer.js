import { Transform } from "./Transform.js";
import { Vector2 } from "./Vectors.js";
import EnumeratedValue from "./EnumeratedValue.js";
export {Renderer};

/**
 * Class representing a Renderer object, which draws sprites to the game canvas.
 * 
 * Methods:
 * - getAnimation() : Returns the animation name of the current animation
 * - updateSpriteSheet(spriteSheetInfo) : Changes the current sprite information
 */
class Renderer
{
    _SpriteSheetInfo;
    _Anchor;
    _Animation;

    transform;
    sprite;
    spriteSheet;
    stage;
    zIndexForce;

    /**
     * Constructs a new Renderer on the provided staage, with the provided spriteSheetInfo.
     * 
     * @param {Object} spriteSheetInfo An object with a "_Json" key and a "_Img" key, providing the animation
     * and frame data and the base texture, respectively.
     * @param {Stage} stage PIXI.Stage to be rendered to.
     * @param {Transform} transform Transform defining position, rotation, and scale of the sprite.
     */
    constructor(spriteSheetInfo, stage, transform = new Transform(), animation='default', zIndexForce = null, anchor = new Vector2(0.5, 0.5))
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');
        
        const func = function(anim) { this.setAnimation(anim); }
        this._Animation = new EnumeratedValue([animation], func, this);
        this.zIndexForce = zIndexForce;
        this.anchor = anchor;
        this.stage = stage;
        this.transform = transform;
        this.updateSpriteSheet(spriteSheetInfo).then(() => {
            this.setAnimation(animation);
            this.sprite.textures[0].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.link();
        });
    }

    get anchor() { return this._Anchor; }
    set anchor(value) { this._Anchor = value; }

    get currentAnimation() { return this._Animation.selected; }
    set currentAnimation(value) 
    {
        this._Animation.value = value;
    }

    getAnimation()
    {
        return this.currentAnimation;
    }
    
    isLoaded()
    {
        return this.sprite != undefined;
    }

    /**
     * Forces the sprite's zIndex (aka draw depth) to be set to a specific number
     * @param {Number} zIndex 
     */
    forceZIndex(zIndex)
    {
        this.zIndexForce = zIndex;
    }
    /**
     * Frees the sprite's zIndex (aka draw depth), causing it to be based on the renderer's position in the room
     */
    unforceZIndex()
    {
        this.zIndexForce = null;
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
        
        // Load animations for level builder use
        const animations = [];
        for (const anim in data.animations)
        {
            animations.push(anim);
        }
        const func = function(anim) { this.setAnimation(anim); }
        this._Animation = new EnumeratedValue(animations, func, this);
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

        this._Animation.selected = animationId;
        this.unlink();
        this.sprite = new PIXI.AnimatedSprite(anim);
        this.link();
        this.sprite.loop = loop;
        this.sprite.animationSpeed = speed;
        this.sprite.play();
        this.update(0);
    }

    /**
     * Updates the position & transform of object being renddered
     * @param {*} delta 
     */
    update(delta)
    {
        if (this.sprite == undefined) return;

        var t = this.transform;
        this.sprite.zIndex = (this.zIndexForce == null) ? t.position.y : this.zIndexForce;
        this.sprite.scale.set(t.scale.x, t.scale.y);
        const w = this.sprite.width;
        const h = this.sprite.height;
        this.sprite.position.set(t.position.x + 8 * t.scale.x, t.position.y + 8 * t.scale.y);
        this.sprite.rotation = t.rotation/180*Math.PI;
        this.sprite.anchor.set(this.anchor.x, this.anchor.y);
    }

    /**
     * Serializes the this renderer to a JSON object string
     * @returns the JSON string representation
     */
    serialize()
    {
        return '{ "type":"Renderer", "anchor":' + this.anchor.serialize() + ', "zIndex":' + this.zIndexForce + ',"spriteSheetInfo": { "json":"' + this._SpriteSheetInfo._Json +
         '", "img":"'+this._SpriteSheetInfo._Img+'"}, "transform": ' + this.transform.serialize() + 
         ', "animation": "'+this.getAnimation()+'"}';
    }

    /**
     * Deserializes the JSON object to a renderer object
     * @param {*} obj the JSON object
     * @param {*} stage the current game stage
     * @returns new renderer object
     */
    static deserialize(obj, stage)
    {
        if (!('zIndex' in obj)) 
            obj.zIndex = null;
        if (!('anchor' in obj))
            obj.anchor = new Vector2(0.5, 0.5);

        return new Renderer(
            {
                _Json : obj.spriteSheetInfo.json,
                _Img : obj.spriteSheetInfo.img
            }, 
            stage,
            Transform.deserialize(obj.transform), 
            obj.animation, 
            obj.zIndex,
            Vector2.deserialize(obj.anchor)
        );
    }
}
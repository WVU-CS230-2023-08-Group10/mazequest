import { Transform } from "./Transform.js";
import { Vector2 } from "./Vectors.js";
import EnumeratedValue from "./EnumeratedValue.js";
export {Renderer};

const spriteSheets = {
    Goblin : {
        json : "./images/enemies/goblin.json",
        img : "./images/enemies/goblin.png"
    },
    Slime : {
        json : "./images/enemies/slime.json",
        img : "./images/enemies/slime.png"
    },
    Dragon : {
        json : "./images/enemies/whiteEyesBlueDragon.json",
        img : "./images/enemies/whiteEyesBlueDragon.png"
    },
    Items : {
        json : "./images/items/Items.json",
        img : "./images/items/Items.png"
    },
    Tiles : {
        json : "./images/tiles/tiles.json",
        img : "./images/tiles/tiles.png"
    },
    LeatherArmor : {
        json : "./images/armor/leatherArmor.json",
        img : "./images/armor/leatherArmor.png"
    },
    IronArmor : {
        json : "./images/armor/ironArmor.json",
        img : "./images/armor/ironArmor.png"
    },
    ExitIndicator : {
        json : "./images/levelEditor/exit_indicator.json",
        img : "./images/levelEditor/exit_indicator.png"
    }
};

/**
 * Class representing a Renderer object, which draws sprites to the game canvas.
 * 
 * Methods:
 * - getAnimation() : Returns the animation name of the current animation
 * - updateSpriteSheet(spriteSheetInfo) : Changes the current sprite information
 */
class Renderer
{
    _SpriteSheet
    _Anchor;
    _Animation;

    transform;
    sprite;
    spriteSheet;
    spriteSheetInfo;
    stage;
    zIndexForce;

    /**
     * Constructs a new Renderer on the provided staage, with the provided spriteSheetInfo.
     * 
     * @param {Object} spriteSheet An object with a "_Json" key and a "_Img" key, providing the animation
     * and frame data and the base texture, respectively.
     * @param {Stage} stage PIXI.Stage to be rendered to.
     * @param {Transform} transform Transform defining position, rotation, and scale of the sprite.
     */
    constructor(spriteSheet, stage, transform = new Transform(), animation='default', zIndexForce = null, anchor = new Vector2(0.5, 0.5))
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');
        
        this._Animation = new EnumeratedValue({ 'default' : animation }, (anim) => this.setAnimation(anim), this);
        this._SpriteSheet = new EnumeratedValue(spriteSheets, (sheet) => {
            this.updateSpriteSheet(sheet).then(() => this.setAnimation('default'));
        }, this);
        this._SpriteSheet.selected = spriteSheet;
        this.zIndexForce = zIndexForce;
        this.anchor = anchor;
        this.stage = stage;
        this.transform = transform;
        this.updateSpriteSheet(this._SpriteSheet.map[this._SpriteSheet.selected]).then(() => {
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

    get spriteSheetName() { return this._SpriteSheet.selected; }

    getAnimation()
    {
        return this.currentAnimation;
    }
    
    isLoaded()
    {
        return this.sprite != undefined;
    }

    playAnimation(speed=1, loop=false)
    {
        if (this.sprite == undefined)
            return;

        if (!this.sprite.playing)
        {
            this.sprite.animationSpeed = speed;
            this.sprite.loop = loop;
            this.sprite.play();
        }
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
     * @returns True if the renderer was successfully disposed, false otherwise.
     */
    dispose()
    {
        if (this.sprite == undefined)
            return false;

        this.unlink();
        //this.sprite.destroy(true);
        return true;
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
        this.spriteSheetInfo = spriteSheetInfo;
        var data = await PIXI.Assets.load(spriteSheetInfo.json);
        this.spriteSheet = new PIXI.Spritesheet(PIXI.Texture.from(spriteSheetInfo.img), data.data);
        await this.spriteSheet.parse();
        
        // Load animations for level builder use
        let animations = {};
        for (const anim in data.animations)
        {
            animations[anim] = anim;
        }
        this._Animation = new EnumeratedValue(animations, (anim) => this.setAnimation(anim), this);
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
        return '{ "type":"Renderer", "anchor":' + this.anchor.serialize() + ', "zIndex":' + this.zIndexForce + ',"spriteSheet": ' + this.spriteSheetName +
         ', "transform": ' + this.transform.serialize() + 
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
            obj.spriteSheet,
            stage,
            Transform.deserialize(obj.transform), 
            obj.animation, 
            obj.zIndex,
            Vector2.deserialize(obj.anchor)
        );
    }
}
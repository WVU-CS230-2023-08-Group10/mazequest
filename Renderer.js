import { Transform } from "./Transform.js";
export {Renderer};

class Renderer
{
    transform;
    sprite;
    spriteSheet;
    spriteSheetInfo;
    currentAnimation;
    stage;

    constructor(spriteSheetInfo, stage, transform = new Transform())
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
        
    link()
    {
        this.stage.addChild(this.sprite);
    }
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
    async updateSpriteSheet(spriteSheetInfo)
    {
        this.spriteSheetInfo = spriteSheetInfo;
        var data = await PIXI.Assets.load(spriteSheetInfo.json);
        this.spriteSheet = new PIXI.Spritesheet(PIXI.Texture.from(spriteSheetInfo.img), data.data);
        await this.spriteSheet.parse();
    }
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
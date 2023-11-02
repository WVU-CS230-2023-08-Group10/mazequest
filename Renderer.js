import { Transform } from "./Transform.js";
export {Renderer};

class Renderer
{
    transform;
    sprite;
    spriteSheet;
    currentAnimation;
    stage;

    constructor(spriteSheet, stage, transform = new Transform())
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');

        this.spriteSheet = spriteSheet;
        this.stage = stage;
        this.transform = transform;
        this.setAnimation('default');
        this.sprite.textures[0].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.link();
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
    setAnimation(animationId, speed=1, loop=false)
    {
        this.currentAnimation = animationId;
        this.unlink();
        this.sprite = new PIXI.AnimatedSprite(this.spriteSheet.animations[animationId]);
        this.link();
        this.sprite.loop = loop;
        this.sprite.animationSpeed = speed;
        this.sprite.play();
    }
    update(delta)
    {
        var t = this.transform;
        this.sprite.setTransform(t.position.x, t.position.y, t.scale.x, t.scale.y, t.rotation);
    }
}
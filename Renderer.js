import { Transform } from "./Transform.js";
export {Renderer};

class Renderer
{
    transform;
    sprite;
    stage;

    constructor(texture, stage, transform = new Transform())
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');

        this.sprite = new PIXI.Sprite(texture);
        this.stage = stage;
        this.transform = transform;
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
        this.unlink();
        this.sprite.destroy(true);
    }
    updateSprite(newTexture)
    {
        this.sprite.texture = newTexture;
    }
    update()
    {
        var pos = this.transform.position;
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.sprite.rotation = this.transform.rotation;
    }
}
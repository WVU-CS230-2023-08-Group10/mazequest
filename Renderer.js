import { Transform } from "./Transform.js";
export {Renderer};

class Renderer
{
    transform;
    sprite;
    stage;

    constructor(texture, stage, transform = new Transform())
    {
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
    setPosition(posVector)
    {
        this.transform.position = posVector;
    }
}
import { Transform } from "./Transform.js";
export {Renderer};

class Renderer
{
    transform;
    sprite;
    stage;

    constructor(sprite, stage, transform = new Transform())
    {
        if (stage == undefined)
            throw new Error('Renderer stage undefined! Was the renderer initialized correctly?');

        this.sprite = sprite;
        this.stage = stage;
        this.transform = transform;
        this.link();
    }
        
    link()
    {
        if (this.sprite == undefined)
            throw new Error("Renderer sprite is undefined! Was there an error loading it?");
        
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
    update(delta)
    {
        var pos = this.transform.position;
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.sprite.rotation = this.transform.rotation;
    }
}
import { Vector2 } from "./Vectors.js";
export {Transform};

class Transform
{
    position;
    scale;
    rotation;

    constructor(position = new Vector2(0,0), scale = new Vector2(1,1), rotation = 0)
    {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }

    translate(vector)
    {
        this.position.add(vector);
    }
}
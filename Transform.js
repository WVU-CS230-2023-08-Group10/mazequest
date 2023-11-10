import { Vector2 } from "./Vectors.js";
export {Transform};

class Transform
{
    position;
    scale;
    rotation;

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} scale
     * @param {Number} rotation 
     */
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

    serialize()
    {
        return '{ "position" : '+this.position.serialize()+', "scale" : '+this.scale.serialize()+', "rotation" : '+this.rotation+'}';
    }

    static deserialize(obj)
    {
        return new Transform(Vector2.deserialize(obj.position), Vector2.deserialize(obj.scale), obj.rotation);
    }
}
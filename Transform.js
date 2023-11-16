import { Vector2 } from "./Vectors.js";
export {Transform};

class Transform
{
    _Position;
    _Scale;
    _Rotation;

    /**
     * 
     * @param {Vector2} position 
     * @param {Vector2} scale
     * @param {Number} rotation 
     */
    constructor(position = new Vector2(0,0), scale = new Vector2(1,1), rotation = 0)
    {
        this._Position = position;
        this._Scale = scale;
        this._Rotation = rotation;
    }

    translate(vector)
    {
        this._Position.add(vector);
    }

    serialize()
    {
        return '{ "position" : '+this._Position.serialize()+', "scale" : '+this._Scale.serialize()+', "rotation" : '+this._Rotation+'}';
    }

    static deserialize(obj)
    {
        return new Transform(Vector2.deserialize(obj.position), Vector2.deserialize(obj.scale), obj.rotation);
    }
}
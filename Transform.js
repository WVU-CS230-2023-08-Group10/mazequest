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

    get position() {
        return this._Position;
    }
    set position(pos) {
        this._Position = pos;
    }

    get scale() {
        return this._Scale;
    }
    set scale(scale) {
        this._Scale = scale
    }

    get rotation() {
        return this._Rotation
    }
    set rotation(rot) {
        this._Rotation = rot;
    }

    translate(vector)
    {
        this._Position.add(vector);
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
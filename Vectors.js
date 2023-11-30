export {Vector2, Direction};

/**
 * Class for creating Vector2 objects (2d points)
 */
class Vector2
{
    _X;
    _Y;

    constructor(x = 0.0, y = 0.0)
    {
        this._X = x;
        this._Y = y;
    }

    get x()
    { 
        return this._X;
    };

    set x(x)
    {
        this._X = x;
    }

    get y()
    {
        return this._Y;
    }
    
    set y(y)
    {
        this._Y = y;
    }

    getMagnitude()
    {
        return Math.sqrt(this._X**2 + this._Y**2);
    }

    add(other)
    {
        this._X += other.x;
        this._Y += other.y;
    }

    static add(v1, v2)
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    subtract(other)
    {
        this.add(Vector2.scalarMultiply(other, -1.0))
    }

    static subtract(v1, v2)
    {
        return Vector2.add(v1, Vector2.scalarMultiply(v2, -1.0));
    }

    scalarMultiply(scalar)
    {
        this._X *= scalar;
        this._Y *= scalar;
    }

    static scalarMultiply(vec, scalar)
    {
        return new Vector2(vec.x * scalar, vec.y * scalar);
    }

    normalize()
    {
        this.scalarMultiply(1.0/this.getMagnitude());
    }

    static normalize(vec)
    {
        return Vector2.scalarMultiply(vec, 1.0/vec.getMagnitude());
    }

    equals(vec)
    {
        return (this._X == vec.x && this._Y == vec.y);
    }

    toString()
    {
        return "("+this._X+", "+this._Y+")"
    }

    copy()
    {
        return new Vector2(this._X, this._Y);
    }

    serialize()
    {
        return '{ "x" : '+this._X+', "y" : '+this._Y+'}';
    }

    static deserialize(obj)
    {
        return new Vector2(obj.x, obj.y);
    }
}

const Direction = {
    Up: new Vector2(0,.0 -1.0),
    Down: new Vector2(0.0, 1.0),
    Left: new Vector2(-1.0, 0.0),
    Right: new Vector2(1.0, 0.0)
}
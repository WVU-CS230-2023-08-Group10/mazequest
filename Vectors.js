export {Vector2, Direction};

class Vector2
{
    x;
    y;

    constructor(x = 0.0, y = 0.0)
    {
        this.x = x;
        this.y = y;
    }

    getMagnitude()
    {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    add(other)
    {
        this.x += other.x;
        this.y += other.y;
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
        this.x *= scalar;
        this.y *= scalar;
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
        return (this.x == vec.x && this.y == vec.y);
    }

    toString()
    {
        return "("+this.x+", "+this.y+")"
    }

    copy()
    {
        return new Vector2(this.x, this.y);
    }
}

const Direction = {
    Up: new Vector2(0,.0 -1.0),
    Down: new Vector2(0.0, 1.0),
    Left: new Vector2(-1.0, 0.0),
    Right: new Vector2(1.0, 0.0)
}
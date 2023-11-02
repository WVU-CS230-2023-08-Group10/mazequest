export {Vector2, Direction};

class Vector2
{
    x;
    y;

    constructor(x, y)
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
        this.scalarMultiply(1/this.getMagnitude);
    }

    static normalize(vec)
    {
        return Vector2.scalarMultiply(vec, 1/vec.getMagnitude());
    }

    toString()
    {
        return "("+this.x+", "+this.y+")"
    }
}

const Direction = {
    Up: new Vector2(0, -1),
    Down: new Vector2(0, 1),
    Left: new Vector2(-1, 0),
    Right: new Vector2(1, 0)
}
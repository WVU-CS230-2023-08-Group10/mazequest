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

    /**
     * Returns the magnitude of this vector (the distance between this point and (0, 0)).
     * 
     * @returns The magnitude of this vector
     */
    getMagnitude()
    {
        return Math.sqrt(this._X**2 + this._Y**2);
    }

    /**
     * Adds another vector (or another object with defenitions for x and y) to this vector,
     * augment this vectors values. If you need to get the sum of two vectors without augmenting either of their
     * values, use the static version of this method.
     * 
     * @param {Vector2?} other The vector to add onto this one.
     */
    add(other)
    {
        this._X += other.x;
        this._Y += other.y;
    }

    /**
     * Adds two vectors (or objects with x and y) together and returns the vector sum of them.
     * Neither addend is modified in the process.
     * 
     * @param {Vector2?} v1 
     * @param {Vector2?} v2 
     * @returns A Vector2 sum of the inputs.
     */
    static add(v1, v2)
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Subtracts another vector (or another object with defenitions for x and y) from this vector,
     * augment this vectors values. If you need to get the difference of two vectors without augmenting 
     * either of their values, use the static version of this method.
     * 
     * @param {Vector2?} other The vector to subtract from this one.
     */
    subtract(other)
    {
        this.add(Vector2.scalarMultiply(other, -1.0))
    }

    /**
     * Subtracts two vectors (or objects with x and y) together and returns the signed vector difference of them.
     * The second input will be subtracted from the first. Neither input is modified in the process.
     * 
     * @param {Vector2?} v1 
     * @param {Vector2?} v2 
     * @returns A Vector2 difference of the inputs.
     */
    static subtract(v1, v2)
    {
        return Vector2.add(v1, Vector2.scalarMultiply(v2, -1.0));
    }

    /**
     * Scales this vector (multiplies each of its components) by a number, augmenting
     * this vectors values.
     * 
     * @param {Number} scalar The number to scale by.
     */
    scalarMultiply(scalar)
    {
        this._X *= scalar;
        this._Y *= scalar;
    }

    /**
     * Scales a vector by the given scalar, returning a new vector that is the result.
     * 
     * @param {Vector2?} vec 
     * @param {Number} scalar 
     * @returns Vector2 of the product
     */
    static scalarMultiply(vec, scalar)
    {
        return new Vector2(vec.x * scalar, vec.y * scalar);
    }

    /**
     * Normalizes this vector, maintaining its direction/angle, but making its magnitude 1.
     */
    normalize()
    {
        this.scalarMultiply(1.0/this.getMagnitude());
    }

    /**
     * Normalizes the given vector, returning the normalized result without changing the
     * input vector.
     * 
     * @param {Vector2?} vec 
     * @returns Vector2
     */
    static normalize(vec)
    {
        return Vector2.scalarMultiply(vec, 1.0/vec.getMagnitude());
    }

    /**
     * Tests to see if this vector is equal to another object. If the object has an x and y
     * value, and those values are equal, this will return true.
     * 
     * @param {*} vec 
     * @returns boolean
     */
    equals(vec)
    {
        try {
            return (this._X == vec.x && this._Y == vec.y);
        } catch (error) {
            return false;
        }
    }

    toString()
    {
        return "("+this._X+", "+this._Y+")"
    }

    /**
     * Makes a deep copy of this vector.
     * 
     * @returns The copy
     */
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
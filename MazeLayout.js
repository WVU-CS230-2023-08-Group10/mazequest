class MazeLayout
{
    
}

class Room
{

}

const Direction = {
    Up: Vector2(0, -1),
    Down: Vector2(0, 1),
    Left: Vector2(-1, 0),
    Right: Vector2(1, 0)
}

class Vector2
{
    x;
    y;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    get getX()
    {
        return this.x;
    }

    get getY()
    {
        return this.y;
    }

    set setX(x)
    {
        this.x = x;
    }

    set setY(y)
    {
        this.y = y;
    }

    add(other)
    {
        this.x += other.x;
        this.y += other.y;
    }
}
export { MazeLayout, GenerationParameters, Vector2, Room, Direction};

class MazeLayout
{
    roomArray = [];
    params;
    roomData;
    file;
    
    constructor(params, file = null)
    {
        this.roomData = this.loadRooms(file);
        this.params = params;
        for (let i = 0; i < params.dimensions.y; i++) {
            this.roomArray[i] = [];
            for (let j = 0; j < params.dimensions.x; j++) {
                this.roomArray[i][j] = null;
            }
        }
    }

    get Params() { return params; }
    set Params(params) { this.params = params; }

    loadRooms(file)
    {
        if (file == null)
            // load the default rooms from the database
            return [];
        else
            // get the custom level from the database
            return [];
    }

    generateRoomLayout()
    {
        // Initialize toBeGenerated array
        var toBeGenerated = [];
        for (let i = 0; i < this.params.dimensions.y; i++) {
            toBeGenerated[i] = [];
            for (let j = 0; j < this.params.dimensions.x; j++) {
                toBeGenerated[i][j] = -1;
            }
        }

        // Get random start position
        var startRow = Math.floor(Math.random() * this.roomArray.length);
        var startCol = Math.floor(Math.random() * this.roomArray[startRow].length);
        var startPos = new Vector2(startCol, startRow);

        var batch = [ startPos ];

        while (batch.length > 0)
        {
            var newBatch = [];
            for (let i = 0; i < batch.length; i++) {
                const pos = batch[i];

                toBeGenerated[pos.y][pos.x] = 1;
                
                var up = Vector2.add(pos, Direction.Up);
                var down = Vector2.add(pos, Direction.Down); 
                var left = Vector2.add(pos, Direction.Left);
                var right = Vector2.add(pos, Direction.Right);

                var adjacent = [up, down, left, right];
                //console.log(adjacent);
                for (let j = 0; j < adjacent.length; j++) {
                    const adj = adjacent[j];

                    if (!this.isPositionInMaze(pos))
                        continue;

                    if (toBeGenerated[adj.y][adj.x] != -1)
                        continue;

                    if (this.params.isGenerated())
                    {
                        toBeGenerated[adj.y][adj.x] = 1;
                        newBatch.push(adj);
                    }
                    else{
                        toBeGenerated[adj.y][adj.x] = 0;
                    }
                }
            }
            batch = newBatch;
        }

        console.log(toBeGenerated);
    }

    isPositionInMaze(pos)
    {
        if (pos.y < 0 || pos.y >= this.roomArray.length)
            return false;

        if (pos.x < 0 || pos.x >= this.roomArray[pos.y].length)
            return false;

        return true;
    }
}

class GenerationParameters
{
    currentRoomCount = 0;
    dimensions;
    minRooms;
    maxRooms;

    constructor(width, height, minRooms, maxRooms) 
    {
        this.dimensions = new Vector2(width, height);
        this.minRooms = minRooms;
        this.maxRooms = maxRooms;
    }

    isGenerated()
    {
        //var chance = 1 - (this.currentRoomCount-this.minRooms)/(this.maxRooms-this.minRooms);
        let generate = Math.random() < 0.5;
        if (generate)
            this.currentRoomCount++;
        return generate;
    }
}

class Room
{
    entities;

    constructor(entities) {
        this.entities = entities;
    }
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

    add(other)
    {
        this.x += other.x;
        this.y += other.y;
    }

    static add(v1, v2)
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }
}

const Direction = {
    Up: new Vector2(0, -1),
    Down: new Vector2(0, 1),
    Left: new Vector2(-1, 0),
    Right: new Vector2(1, 0)
}
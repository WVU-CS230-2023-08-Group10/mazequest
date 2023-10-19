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

        // Make a batch of rooms to generate
        var batch = [ startPos ];

        while (batch.length > 0)
        {
            // Make the next batch
            var newBatch = [];
            // Iterate through the batch
            for (let i = 0; i < batch.length; i++) {
                const pos = batch[i];

                // Generate the batch element
                toBeGenerated[pos.y][pos.x] = 1;
                
                // Get the adjacent rooms
                var up = Vector2.add(pos, Direction.Up);
                var down = Vector2.add(pos, Direction.Down); 
                var left = Vector2.add(pos, Direction.Left);
                var right = Vector2.add(pos, Direction.Right);

                var adjacent = [up, down, left, right];
                // Iterate through adjacent rooms
                for (let j = 0; j < adjacent.length; j++) {
                    const adj = adjacent[j];

                    // If the room isn't within the maze, skip
                    if (!this.isPositionInMaze(adj))
                        continue;
                    // If the room has already been generated, skip
                    if (toBeGenerated[adj.y][adj.x] != -1)
                        continue;
                    // Should the room be generated?
                    if (this.params.isGenerated())
                    {
                        // If yes, add to batch
                        newBatch.push(adj);
                    }
                    else
                    {
                        // If no, set toBeGenerated to 0;
                        toBeGenerated[adj.y][adj.x] = 0;
                    }
                }
            }
            // Reset the batch
            batch = newBatch;
        }

        var logStr = "";    
        var tiles = ['-','╨','╞','╚','╥','║','╔','╠','╡','╝','═','╩','╗','╣','╦','╬'];
        for (let i = 0; i < this.params.dimensions.y; i++) {
            for (let j = 0; j < this.params.dimensions.x; j++) {
                if (toBeGenerated[i][j] <= 0)
                {
                    logStr += ' ';
                    continue;
                }

                var pos = new Vector2(j, i);
                toBeGenerated[i][j] = 0;

                var up = Vector2.add(pos, Direction.Up);
                var down = Vector2.add(pos, Direction.Down); 
                var left = Vector2.add(pos, Direction.Left);
                var right = Vector2.add(pos, Direction.Right);

                var adjacent = [up, right, down, left];
                for (let a = 0; a < adjacent.length; a++) {
                    const adj = adjacent[a];
                    if (!this.isPositionInMaze(adj)) continue;
                    if (toBeGenerated[adj.y][adj.x] > 0)
                    {
                        toBeGenerated[i][j] += 1 << a;
                    }
                }

                logStr += tiles[toBeGenerated[i][j]];
            }
            logStr += "\n";
        }
        console.log(logStr);
        console.log(this.params.currentRoomCount);
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
    currentIteration = 0;
    dimensions;
    minRooms;
    maxRooms;
    clumping;

    /**
     * Constructor for GenerationParameters. These parameters are used in MazeLayout to influence that shape and size of the maze generated.
     * 
     * @param {integer} width Width, in rooms, of the layout
     * @param {integer} height Height, in rooms, of the layout
     * @param {integer} minRooms Minimum number of rooms the layout will generate with. With low clumping values, this minimum is not necessarily a hard rule.
     * @param {integer} maxRooms Maximum number of reooms the layout will generate with.
     * @param {float} clumping A value between 0 and 1 that represents the maximum chance that a given tile is generated.
     * At 0, this means that absolutely no generation can happen (don't set this to 0.).
     * At 1, the algorithm will gaurantee a tile is generated if we haven't yet reached minRooms. This behavior basically
     * makes grids of rooms, instead of more interesting layouts. Also not recommended. Values around 0.5 are ideal.
     */
    constructor(width = 10, height = 10, minRooms = 8, maxRooms = 16, clumping = 0.5) 
    {
        this.dimensions = new Vector2(width, height);
        this.minRooms = minRooms;
        this.maxRooms = maxRooms;
        this.clumping = clumping;
    }

    isGenerated()
    {
        // Chance scales down as we approach max rooms
        var chance = 1 - (this.currentRoomCount-this.minRooms)/(this.maxRooms-this.minRooms);
        chance *= this.clumping;
        var boundsProtection = 1 - (this.currentRoomCount/this.currentIteration);
        if (this.currentRoomCount < this.minRooms)
            chance = chance + (boundsProtection * (1-chance));
        else if (this.currentRoomCount > this.maxRooms)
            chance = 0;
        let generate = Math.random() < chance;

        // Tick up counters
        this.currentIteration++;
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
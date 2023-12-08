import { Vector2, Direction } from "./Vectors.js";

export { MazeLayout, GenerationParameters};

class MazeLayout
{
    roomArray = [];
    params;
    roomData;
    file;
    game;
    startPosition;
    
    constructor(params, file = null, game = undefined)
    {
        this.roomData = this.loadRooms(file);
        this.params = params;
        for (let i = 0; i < params.dimensions.y; i++) {
            this.roomArray[i] = [];
            for (let j = 0; j < params.dimensions.x; j++) {
                this.roomArray[i][j] = null;
            }
        }

        this.game = game;
    }

    get params() { return params; }
    set params(params) { this.params = params; }

    loadRooms(file)
    {
        //this.game.registerEntity();
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
        let toBeGenerated = [];
        for (let i = 0; i < this.params.dimensions.y; i++) {
            toBeGenerated[i] = [];
            for (let j = 0; j < this.params.dimensions.x; j++) {
                toBeGenerated[i][j] = -1;
            }
        }

        // Get random start position
        const startRow = Math.floor(Math.random() * this.roomArray.length);
        const startCol = Math.floor(Math.random() * this.roomArray[startRow].length);
        this.startPosition = new Vector2(startCol, startRow);

        // Make a batch of rooms to generate
        let batch = [ startPos ];
        let pos, up, down, left, right, adjacent, adj;

        while (batch.length > 0)
        {
            // Make the next batch
            let newBatch = [];
            // Iterate through the batch
            for (let i = 0; i < batch.length; i++) {
                pos = batch[i];

                // Generate the batch element
                toBeGenerated[pos._Y][pos._X] = 1;
                
                // Get the adjacent rooms
                up = Vector2.add(pos, Direction.Up);
                down = Vector2.add(pos, Direction.Down); 
                left = Vector2.add(pos, Direction.Left);
                right = Vector2.add(pos, Direction.Right);

                adjacent = [up, down, left, right];
                // Iterate through adjacent rooms
                for (let j = 0; j < adjacent.length; j++) {
                    adj = adjacent[j];

                    // If the room isn't within the maze, skip
                    if (!this.isPositionInMaze(adj))
                        continue;
                    // If the room has already been generated, skip
                    if (toBeGenerated[adj._Y][adj._X] != -1)
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
                        toBeGenerated[adj._Y][adj._X] = 0;
                    }
                }
            }
            // Reset the batch
            batch = newBatch;
        }

        let logStr = "";    
        const tiles = ['-','╨','╞','╚','╥','║','╔','╠','╡','╝','═','╩','╗','╣','╦','╬'];
        for (let i = 0; i < this.params.dimensions.y; i++) {
            for (let j = 0; j < this.params.dimensions.x; j++) {
                if (toBeGenerated[i][j] <= 0)
                {
                    logStr += ' ';
                    continue;
                }

                pos = new Vector2(j, i);
                toBeGenerated[i][j] = 0;

                up = Vector2.add(pos, Direction.Up);
                down = Vector2.add(pos, Direction.Down); 
                left = Vector2.add(pos, Direction.Left);
                right = Vector2.add(pos, Direction.Right);

                adjacent = [up, right, down, left];
                for (let a = 0; a < adjacent.length; a++) {
                    const adj = adjacent[a];
                    if (!this.isPositionInMaze(adj)) continue;
                    if (toBeGenerated[adj._Y][adj._X] > 0)
                    {
                        toBeGenerated[i][j] += 1 << a;
                    }
                }

                logStr += tiles[toBeGenerated[i][j]];
                // TODO: this.roomArray[i][j] = query room with index (toBeGenerated[i][j]);
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
        let chance = 1 - (this.currentRoomCount-this.minRooms)/(this.maxRooms-this.minRooms);
        chance *= this.clumping;
        let boundsProtection = 1 - (this.currentRoomCount/this.currentIteration);
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
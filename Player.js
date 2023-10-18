class Player extends Entity{
    Account = 0;
    Health = 10;
    Inventory = Array(7);
    
    Room;
    constructor(health)
    {
        this.Health=health;
        Inventory.add(null);
        Inventory.add(null);
    }
    constructor(account, health)
    {
        this.Account=account;
        this.Health=health;
    }
    pickUp(Armor)
    {
        if(Inventory.at(1)==null)
        {
            Inventory.add(Armor,1);
        }
    }
    pickUp(Weapon)
    {
        if(Inventory.at(0)==null)
        {
            Inventory.add(Weapon, 0);
        }
    }
    pickUp(ObscureObject)
    {
        if(Inventory.size()<Inventory.length)
        {
            Inventory.append(ObscureObject);
        }
    }
    dropObscureObject(index)
    {
        if(Inventory.at(Index)!=null)
        {
            Inventory.add(null, index);
        }
    }
    dropWeapon()
    {
        if(Inventory.at(0)!=null)
        {
            Inventory.add(null, 0);
        }
    }
    dropArmor()
    {
        if(Inventory.at(1)!=null)
        {
            Inventory.add(null,1);
        }
    }
    damage(damageDone)
    {
        health-damageDone;
        if(health<1)
        {
            //game over
        }
    }
    initializeCombat()
    {
        // call combat
    }
    position(room,tile)
    {
        this.room=room;
        this.tile=tile;
    }
    move(direction)
    {
        var position;
        switch (direction) {
            case value: right
                position = MazeLayout.Direction.Right;
            case value: left 
                position = MazeLayout.Direction.Left;
            case value: down
                position = MazeLayout.Direction.Down;
            case value: up
                position = MazeLayout.Direction.Up;
            default: 
                break;
        }
        //check case for wall
        if(position==wall)
        {
            //return original position
        }
        //check case for wall
        if(position==door.room)
        {
            //return new position in new room
        }
        //check case for Mob
        if(position.hasMob())
        {
            //initiate combat then return original position
        }
        else
        {
            //return position
        }
    }
    display()
    {
        //returns character sprite at position
    }
    
    }

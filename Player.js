class Player extends Entity{
    Account;
    Health = 10;
    Inventory = Array(7);
    
    Room;
    constructor(health){
        this.Health=health;
        Inventory.add(null);
        Inventory.add(null);
    }
    constructor(account, health){
        this.Account=account;
        this.Health=health;
    }
    pickUp(Armor){
        if(Inventory.at(1)==null){
            Inventory.add(Armor,1);
        }
    }
    pickUp(Weapon){
        if(Inventory.at(0)==null){
            Inventory.add(Weapon, 0);
        }
    }
    pickUp(ObscureObject){
        if(Inventory.size()<Inventory.length){
            Inventory.append(ObscureObject);
        }
    }
    dropObscureObject(index){
        if(Inventory.at(Index)!=null){
            Inventory.add(null, index);
        }
    }
    dropWeapon(){
        if(Inventory.at(0)!=null){
            Inventory.add(null, 0);
        }
    }
    dropArmor(){
        if(Inventory.at(1)!=null){
            Inventory.add(null,1);
        }
    }
    damage(damageDone){
        health-damageDone;
        if(health<1){
            //game over
        }
    }
    initializeCombat(){
        // call combat
    }
    position(room,tile){
        this.room=room;
        this.tile=tile;
    }
    //move functions
    //display function (renders character on tile with sprite)
    }

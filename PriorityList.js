export {PriorityList};

// actionDict = {"Attack":0, "AttackBase":0, "AttackWeight":0, "Move":0, "moveWeight":0, "Item":0, "Wait":0};
class PriorityList 
{
    attack;
    attackBase;
    attackweight;

    move;
    moveBase;
    moveWeight;

    item;
    itemBase;
    itemWeight;

    wait;
    waitBase;
    waitWeight;

    PriorityList(attackBase=0, attackweight=0, moveBase=0, moveWeight=0, itemBase=0, itemWeight=0, waitBase=0, waitWeight=0) 
    {
        this.attack, this.attackBase = attackBase;
        this.move, this.moveBase = moveBase;
        this.item, this.itemBase = itemBase;
        this.wait, this.waitBase = waitBase;

        this.attackWeight = attackWeight;
        this.moveWeight = moveWeight;
        this.itemWeight = itemWeight;
        this.waitWeight = waitWeight;
    }

    updatePriority() 
    {
        this.attack += this.attackWeight;
        this.move += this.moveWeight;
        this.item += this.itemWeight;
        this.wait += this.waitWeight;
    }

    
}
export {PriorityList, Action };


class Action
{
    name;
    priority;
    base;
    increment;

    constructor(name="", priority=0, base=0, increment=0) {

        this.name = name;
        this.priority = priority;
        this.base = base;
        this.increment = increment;
    }

    incrementPriority(){
        this.priority += this.increment;
    }

    resetPriority(){
        this.priority = this.base;
    }
}

class PriorityList
{
    AIDict;

    PriorityList(actions){
        this.AIDict = actions;
    }

    addPriority(){
        for (const action of this.AIDict)
            action.addPriority();

        this.sortPriority();
    }

    resetPriority(i=0){
        this.AIDict[i].resetPriority();

        this.sortPriority();
    }

    sortPriority(){
        this.AIDict.sort((a, b) => b.priority - a.priority);
    }

    getPriorityAction()
    {
        return this.AIDict[0];
    }
}
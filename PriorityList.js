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

    serialize()
    {
        return JSON.stringify({
            name : this.name,
            priority : this.priority,
            base : this.base,
            increment : this.increment
        });
    }

    static deserialize(obj)
    {
        return new Action(obj.name, obj.priority, obj.base, obj.increment);
    }
}

class PriorityList
{
    AIDict = [];

    constructor(actions){

        this.AIDict = actions;

    }

    addPriority()
    {
        for (const action of this.AIDict)
            action.incrementPriority();

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

    serialize()
    {
        let str = '[';
        for (let i = 0; i < this.AIDict.length; i++)
        {
            const action = this.AIDict[i];
            str += c.serialize();
            if (i != this.AIDict.length-1)
                str += ', ';
        }
        str += ']';
        return str;
    }

    static deserialize(obj)
    {
        let actions = [];
        for (const action of obj)
        {
            actions.push(Action.deserialize(action));
        }
        return new PriorityList(actions);
    }
}
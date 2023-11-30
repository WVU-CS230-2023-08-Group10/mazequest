export {PriorityList, action};


class action
{
    name;
    priority;
    base;
    increment;

    action(name="", priority=0, base=0, increment=0) {

        this.name = name;
        this.priority = priority;
        this.base = base;
        this.increment = increment;
    }

    addPriority(){
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
        for (let i = 0; i < this.AIDict.size(); i++){
            this.AIDict[i].priority += this.AIDict[i].increment;
        }

        this.sortPriority();
    }

    resetPriority(i=0){
        this.AIDict[i].priority = this.AIDict[i].base;

        this.sortPriority();
    }

    sortPriority(){
        this.AIDict.sort((a, b) => b.priority - a.priority);
    }
}
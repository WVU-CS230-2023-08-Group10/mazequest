/**
 *  EnumeratedValue class. Wraps a key, value, and map of valid key-value pairs.
 */
export default class EnumeratedValue
{
    map;
    selected;
    updateFunction;
    owner;

    constructor(map, valueUpdatedFunc=null, owner=null)
    {
        if (Object.keys(map).length <= 0) {
            throw new Error("EnumeratedValue: 'map' argument must contain at minimum 1 key-value pair.");
        }

        this.owner = owner;
        this.map = map;
        this.selected = Object.keys(this.map).at(0);
        this.updateFunction = valueUpdatedFunc;
    }

    get value()
    {
        return this.map[this.selected];
    }

    /**
     * value setter, passes changes to the EnumeratedValue up to it's owner's updateFunction
     * so you can define how an object that has this as a member behaves when this value
     * changes.
     */
    set value(value)
    {
        this.selected = value;

        if (this.owner != null)
            this.updateFunction.call(this.owner, this.value);
    }

    setValue(value)
    {
        if (!(value in this.map))
            throw new Error('Cannot set value of EnumeratedValue to invalid value.');

        this.value = value;
    }

    nextValue()
    {
        let flag = false;
        for (const prop in this.map)
        {
            if (flag)
            {
                this.setValue(this.map[prop]);
                return;
            }
            else if (prop == this.selected)
            {
                flag = true;
            }
        }

        if (flag)
        {
            this.setValue(Object.keys(this.map).at(0));
        }
    }
}
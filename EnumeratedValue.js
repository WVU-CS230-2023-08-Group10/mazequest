/**
 *  EnumeratedValue class. Wraps a value and array of valid values.
 */
export default class EnumeratedValue
{
    values;
    selected;
    updateFunction;
    owner;

    constructor(values, valueUpdatedFunc=null, owner=null)
    {
        if (values.length <= 0) {
            throw new Error("EnumeratedValue: 'values' argument must contain at minimum 1 value.");
        }

        this.owner = owner;
        this.values = values;
        this.selected = this.values[0];
        this.updateFunction = valueUpdatedFunc;
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
            this.updateFunction.call(this.owner, value);
    }

    setValue(value)
    {
        if (this.values.find((e) => e == value) == undefined)
            throw new Error('Cannot set value of EnumeratedValue to invalid value.');

        this.value = value;
    }
}
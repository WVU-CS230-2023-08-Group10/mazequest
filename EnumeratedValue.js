export default class EnumeratedValue
{
    values;
    selected;
    updateFunction;
    owner;

    constructor(values, valueUpdatedFunc, owner)
    {
        if (values.length <= 0) {
            throw new Error("EnumeratedValue: 'values' argument must contain at minimum 1 value.");
        }

        this.owner = owner;
        this.values = values;
        this.selected = this.values[0];
        this.updateFunction = valueUpdatedFunc;
        console.log(this.updateFunction + " : " + valueUpdatedFunc);
    }

    set value(value)
    {
        this.selected = value;
        this.updateFunction.call(this.owner, value);
    }
}
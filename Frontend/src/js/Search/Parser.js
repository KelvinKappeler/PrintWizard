import {ObjectValue, PrimitiveValue} from "../def.js";

export class Parser {
    constructor(trace) {
        this.trace = trace;
    }

    //sf Person.name >= 12

    executeQuery(query) {

        const queryParts = query.split(' ');
        const command = queryParts[0];
        const args = queryParts.slice(1);
        let result = undefined;

        switch (command) {
            case 'toggle':
                this.trace.treeTrace.triangle.toggleAll();
                break;

            case 'testSearch':
                result = this.trace.getObjectsGivenCondition((value) => {
                    if (value instanceof PrimitiveValue) {
                       return value.value === "Toyota";
                   }
                   return false;
                });
                break;

            case 'sf':
                if (args.length !== 3) {
                    console.log('Usage: sf <class>.<field> <operator> <value>');
                    return;
                }

                const arg0 = args[0].split('.');
                const className = arg0[0]
                const fieldName = arg0[1];
                const operator = args[1];
                const valueToCompare = args[2];

                result = this.trace.getObjectsGivenCondition((value) => {
                    if (value instanceof ObjectValue && value.dataType === className) {
                        if (operator === "=" || operator === "==" || operator === "===") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() === valueToCompare);
                        }
                        if (operator === ">=") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() >= valueToCompare);
                        }
                        if (operator === "<=") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() <= valueToCompare);
                        }
                        if (operator === ">") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() > valueToCompare);
                        }
                        if (operator === "<") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() < valueToCompare);
                        }
                        if (operator === "!=" || operator === "!==") {
                            return value.fields.some(field => field[0] === fieldName && field[1].value.toString() !== valueToCompare);
                        }

                    }
                    return false;
                });
                break;

            default:
                console.log('Unknown command');
                break;
        }

        console.log(result);
    }
}

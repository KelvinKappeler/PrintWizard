import {ObjectValue, PrimitiveValue} from "../def.js";

export class Parser {
    constructor(trace) {
        this.trace = trace;
    }

    static performComparison(fieldType, fieldActualValue, compareValue, compareFunction) {
        if (fieldType === 'int') {
            fieldActualValue = Number(fieldActualValue);
            compareValue = Number(compareValue);
        } else {
            fieldActualValue = String(fieldActualValue);
            compareValue = String(compareValue);
        }
        return compareFunction(fieldActualValue, compareValue);
    }

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
                const lineOption = args.find(arg => arg.startsWith('--line='));
                const hasFirstOrLastOption = args.includes('--first') || args.includes('--last');
                const firstOrLastOption = hasFirstOrLastOption ? args[args.length - 1] : null;
                const queryArgs = args.filter(arg => !arg.startsWith('--line=') && arg !== '--first' && arg !== '--last');

                if (args.length < 3) {
                    console.log('Usage: sf <class>.<field> <operator> <value> [--first|--last]');
                    return;
                }

                const [className, fieldName] = queryArgs[0].split('.');
                const operator = queryArgs[1];
                const valueToCompare = queryArgs[2];

                if (!className || !fieldName) {
                    console.log('Invalid class or field name in query');
                    return;
                }

                const operatorFunctions = {
                    "=": (a, b) => a === b,
                    "==": (a, b) => a === b,
                    "===": (a, b) => a === b,
                    "!=": (a, b) => a !== b,
                    "!==": (a, b) => a !== b,
                    ">=": (a, b) => a >= b,
                    "<=": (a, b) => a <= b,
                    ">": (a, b) => a > b,
                    "<": (a, b) => a < b
                };

                const allResults = this.trace.getObjectsGivenCondition((value) => {
                    if (value instanceof ObjectValue && value.dataType === className) {
                        const compare = operatorFunctions[operator];
                        if (!compare) {
                            console.log(`Unsupported operator: ${operator}`);
                            return false;
                        }

                        return value.fields.some(([fieldKey, fieldValue]) => {
                            if (fieldKey === fieldName) {
                                return Parser.performComparison(
                                    fieldValue.dataType,
                                    fieldValue.value,
                                    valueToCompare,
                                    compare
                                );
                            }
                            return false;
                        });
                    }
                    return false;
                });

                if (lineOption) {
                    const lineNumber = Number(lineOption.split('=')[1]);
                    if (!isNaN(lineNumber)) {
                        result = allResults.filter(obj => obj[0].lineNumber === lineNumber);
                    } else {
                        console.log('Invalid line number in --line=<number> option');
                        return;
                    }
                } else {
                    result = allResults;
                }

                if (firstOrLastOption === '--first') {
                    result = result[0] || null;
                } else if (firstOrLastOption === '--last') {
                    result = result[result.length - 1] || null;
                }
                break;

            default:
                console.log('Unknown command');
                break;
        }

        console.log(result);
    }
}

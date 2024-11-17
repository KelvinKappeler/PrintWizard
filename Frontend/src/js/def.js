import {TraceSpan, TraceSpanType} from "./trace.js";
import {ObjectInspector} from "./inspectors/objectInspector.js";

class TraceElement {
    constructor(lineNumber, content) {
        this.lineNumber = lineNumber;
        this.content = content;
    }

    append(trace) {}
}

export class StatementTrace extends TraceElement {
    constructor(lineNumber = 0, content = [], line = "") {
        super(lineNumber, content);
        this.line = line;
    }

    append(trace) {
        const lineFragment = document.createDocumentFragment();
        lineFragment.appendChild(TraceSpan.wrapKeywords(this.line));
        trace.createBlock(this.lineNumber, lineFragment, true);

        for (let traceElem of this.content) {
            traceElem.append(trace);
        }

        trace.closeBlock();
    }
}

export class ExpressionTrace extends TraceElement {
    constructor(lineNumber = 0, content = "", result = undefined, assigns = undefined) {
        super(lineNumber, content);
        this.result = result;
        this.assigns = assigns;
    }

    append(trace) {
        const contentFragment = document.createDocumentFragment();
        contentFragment.appendChild(TraceSpan.wrapKeywords(this.content));

        if (this.result) {
            contentFragment.appendChild(document.createTextNode(" -> "));
            const spanType = this.result instanceof PrimitiveValue ? TraceSpanType.ReturnValuePrimitive : TraceSpanType.ReturnValue;
            const returnValFragment = this.result.documentFragment(spanType);
            contentFragment.appendChild(returnValFragment);
        }

        trace.addLine(this.lineNumber, contentFragment);
    }
}

export class AssignmentExpressionTrace extends TraceElement {
    constructor(lineNumber = 0, content = "", assigns = undefined) {
        super(lineNumber, content);
        this.assigns = assigns;
    }

    append(trace) {
        const contentFragment = document.createDocumentFragment();
        this.assigns.forEach((assign, index) => {
            contentFragment.appendChild(document.createTextNode(
                assign[0].dataType + " " + assign[1] + " := ")
            );
            const spanType = assign[0] instanceof PrimitiveValue ? TraceSpanType.ReturnValuePrimitive : TraceSpanType.ReturnValue;
            contentFragment.appendChild(assign[0].documentFragment(spanType));

            if (index < this.assigns.length - 1) {
                contentFragment.appendChild(document.createTextNode(" / "));
            }
        });

        trace.addLine(this.lineNumber, contentFragment);
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber = "", content = [], name = "", args = [], returnVal = null, isVoid = false, isExternal = false) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
        this.isVoid = isVoid;
        this.isExternal = isExternal;
    }

    append(trace) {
        const isHidden = trace.blockStack.length > 1;

        if (this.content.length === 0) {
            trace.addLine(this.lineNumber, this.createHeaderFragment(), null, isHidden);
        } else {
            trace.createBlock(this.lineNumber, this.createHeaderFragment(), isHidden);

            for (let traceElem of this.content) {
                traceElem.append(trace);
            }

            trace.closeBlock();
        }
    }

    createHeaderFragment() {
        const headerFragment = document.createDocumentFragment();

        headerFragment.appendChild(TraceSpan.createSpan(TraceSpanType.FunctionName, this.name));
        headerFragment.appendChild(TraceSpan.createSpan(TraceSpanType.Parenthesis, '('));
        this.args.forEach((arg, index) => {
            const typeSpan = arg instanceof PrimitiveValue ? TraceSpanType.ArgsValuePrimitive : TraceSpanType.ArgsValue;
            const fragment = arg.documentFragment(typeSpan);
            headerFragment.appendChild(fragment);

            if (index < this.args.length - 1) {
                headerFragment.appendChild(document.createTextNode(", "));
            }
        });
        headerFragment.appendChild(TraceSpan.createSpan(TraceSpanType.Parenthesis, ')'));

        if (this.returnVal) {
            const typeSpan = this.returnVal instanceof PrimitiveValue ? TraceSpanType.ReturnValuePrimitive : TraceSpanType.ReturnValue;
            const returnValFragment = this.returnVal.documentFragment(typeSpan);
            headerFragment.appendChild(document.createTextNode(" -> "));
            headerFragment.appendChild(returnValFragment);
        }

        return headerFragment;
    }
}

export class Value {
    constructor(dataType) {
        this.dataType = dataType;
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {}

    static newValue(element, objectData) {
        if (element.dataType === 'instanceRef') {
            return new ObjectValue(
                element.className.className,
                element.pointer,
                element.version,
                Value.newFieldsValue(objectData.getLastVersion(element.pointer, element.version).fields, objectData),
                objectData
            );
        } else if (element.dataType === 'arrayRef') {
            return new ArrayValue(
                element.elemType,
                objectData.objectData.find(node => node.self.pointer === element.pointer).values.values,
                element.pointer,
                element.version,
                objectData
            );
        } else {
            return new PrimitiveValue(element.dataType, element.value);
        }
    }

    static newFieldsValue(fields, objectData) {
        return fields.map(field => {
            if (field.value.dataType === 'instanceRef') {
                return [field.identifier.name, new ObjectValue(
                    field.value.className.className,
                    field.value.pointer,
                    field.value.version,
                    Value.newFieldsValue(objectData.getLastVersion(field.value.pointer, field.value.version).fields, objectData),
                    objectData)];
            } else if (field.value.dataType === 'arrayRef') {
                return [field.identifier.name, new ArrayValue(
                    field.value.elemType,
                    field.value.values,
                    field.value.pointer,
                    field.value.version,
                    objectData
                )];
            } else {
                return [field.identifier.name, new PrimitiveValue(field.value.dataType, field.value.value)];
            }
        });
    }

    static newArrayValues(arrayValues, objectData) {
        return arrayValues.map(arrayValue => {
            if (arrayValue.dataType === 'instanceRef') {
                return new ObjectValue(
                    arrayValue.className.className,
                    arrayValue.pointer,
                    arrayValue.version,
                    Value.newFieldsValue(objectData.getLastVersion(arrayValue.pointer, arrayValue.version).fields, objectData),
                    objectData
                );
            } else if (arrayValue.dataType === 'arrayRef') {
                return new ArrayValue(
                    arrayValue.elemType,
                    arrayValue.values,
                    arrayValue.pointer,
                    arrayValue.version,
                    objectData
                );
            } else {
                return new PrimitiveValue(arrayValue.dataType, arrayValue.value);
            }
        });
    }
}

export class ObjectValue extends Value {
    constructor(dataType = "", pointer = null, version = 0, fields = [], states) {
        super(dataType);
        this.pointer = pointer;
        this.version = version;
        this.fields = fields;
        this.states = states;
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {
        const df = document.createDocumentFragment();
        const span = TraceSpan.createSpan(
            traceSpanType,
            this.dataType + ": $" + this.pointer
        );
        span.addEventListener('click', () => {
            ObjectInspector.add(this);
        });
        df.appendChild(span);
        return df;
    }
}

export class PrimitiveValue extends Value {
    constructor(dataType = "", value = "") {
        super(dataType);
        this.value = value;
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {
        const df = document.createDocumentFragment();
        const span = TraceSpan.createSpan(
            traceSpanType,
            this.dataType + ": " + this.value
        );
        df.appendChild(span);
        return df;
    }
}

export class ArrayValue extends Value {
    constructor(dataType = "", elements = [], pointer = null, version = 0, objectData) {
        super(dataType);
        this.elements = Value.newArrayValues(elements, objectData);
        this.pointer = pointer;
        this.version = version;
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {
        const df = document.createDocumentFragment();
        console.log(this.elements);
        const span = document.createElement('span');
        span.append(document.createTextNode("Array: ["));
        this.elements.forEach((element, index) => {
            const spanType = element instanceof PrimitiveValue ? TraceSpanType.ReturnValuePrimitive : TraceSpanType.ReturnValue
            span.appendChild(element.documentFragment(spanType));
            if (index < this.elements.length - 1) {
                span.appendChild(document.createTextNode(", "));
            }
        });
        span.append(document.createTextNode("]"));
        df.appendChild(span);
        return df;
    }
}

export class LoopTrace extends TraceElement {
    constructor(lineNumber, content) {
        super(lineNumber, content);
    }
}

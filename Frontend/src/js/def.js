import {TraceSpan, TraceSpanType} from "./Trace.js";
import {ObjectInspector} from "./inspectors/objectInspector.js";

class TraceElement {
    constructor(lineNumber, content, parent = undefined) {
        this.lineNumber = lineNumber;
        this.content = content;
        this.element = undefined;
        this.parent = parent;
    }

    append(trace) {}

    searchObject2(condition) {}

    searchObject(objectValue) {}

    inlineLoops() {
        let activeLoop = undefined;
        let newContent = [];
        let currentLoopIteration = 0;
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i] instanceof StatementTrace && this.content[i].isLoopStatement()) {
                const stm = this.content[i].inlineLoops();
                if (activeLoop && activeLoop.line !== stm.line) {
                    newContent.push(activeLoop);
                    activeLoop = undefined;
                    currentLoopIteration = 0;
                }
                if (!activeLoop) {
                    activeLoop = new LoopTrace(this.content[i].lineNumber, [], this, this.content[i].line);
                    if (this.content[i].isForLoopStatement()) {
                        stm.parent = activeLoop
                        activeLoop.initialStatement = stm;
                        continue;
                    }
                }
                const index = stm.content.findIndex(e => e instanceof ExpressionTrace);
                if (index === -1) {
                    stm.content.forEach(elem => elem.parent = activeLoop);
                    activeLoop.incrementationStatement.push(stm.content);
                } else {
                    let cond = stm.content.slice(0, index + 1);
                    cond.forEach(elem => elem.parent = activeLoop);

                    const loopIteration = new LoopIterationTrace(
                        activeLoop.lineNumber, stm.content.slice(index + 1), activeLoop, activeLoop.line, currentLoopIteration, cond
                    );
                    currentLoopIteration++;

                    if (loopIteration.content.length !== 0) {
                        loopIteration.content.forEach(elem => elem.parent = loopIteration);
                    }

                    if (loopIteration.conditionalStatement.length !== 0) {
                        loopIteration.conditionalStatement.forEach(elem => elem.parent = activeLoop);
                    }

                    activeLoop.content.push(loopIteration);
                }

            } else {
                if (activeLoop) newContent.push(activeLoop);
                currentLoopIteration = 0;
                activeLoop = undefined;
                newContent.push(this.content[i].inlineLoops());
            }
        }
        if (activeLoop) newContent.push(activeLoop);

        this.content = newContent;
        return this;
    }
}

export class StatementTrace extends TraceElement {
    constructor(lineNumber = 0, content = [], parent = undefined, line = "") {
        super(lineNumber, content, parent);
        this.line = line;
        this.triangle = undefined;
    }

    append(trace) {
        const lineFragment = document.createElement('span');

        lineFragment.appendChild(TraceSpan.wrapKeywords(this.line));
        this.triangle = trace.createBlock(this.lineNumber, lineFragment, true);

        for (let traceElem of this.content) {
            traceElem.append(trace);
        }

        trace.closeBlock();

        this.element = lineFragment;
    }

    searchObject2(condition) {
        let elements = []

        for (let traceElem of this.content) {
            const val = traceElem.searchObject2(condition);
            if (val.length > 0) {
                elements = elements.concat(val);
            }
        }

        return elements;
    }

    searchObject(objectValue) {
        const elements = []
        for (let traceElem of this.content) {
            const res = traceElem.searchObject(objectValue);
            if (res) {
                elements.push(res);
            }
        }
        if (elements.length === 0) return undefined;
        return elements.reduce((prev, curr) => prev[1] < curr[1] ? prev : curr);
    }

    inlineLoops() {
        return super.inlineLoops();
    }

    isLoopStatement() {
        return this.isForLoopStatement() || this.isWhileStatement();
    }

    isForLoopStatement() {
        return this.line.substring(0, 4) === "for " || this.line.substring(0, 4) === "for(";
    }

    isWhileStatement() {
        return this.line.substring(0, 6) === "while " || this.line.substring(0, 6) === "while(";
    }
}

export class ExpressionTrace extends TraceElement {
    constructor(lineNumber = 0, content = "", parent = undefined, result = undefined, assigns = undefined) {
        super(lineNumber, content, parent);
        this.result = result;
        this.assigns = assigns;
    }

    append(trace) {
        const contentFragment = document.createElement('span');
        contentFragment.appendChild(TraceSpan.wrapKeywords(this.content));

        if (this.result) {
            contentFragment.appendChild(document.createTextNode(" -> "));
            const spanType = this.result instanceof PrimitiveValue ? TraceSpanType.ReturnValuePrimitive : TraceSpanType.ReturnValue;
            const returnValFragment = this.result.documentFragment(spanType);
            contentFragment.appendChild(returnValFragment);
        }

        trace.addLine(this.lineNumber, contentFragment);
        this.element = contentFragment;
    }

    searchObject2(condition) {
        let elements = []

        if (condition(this.result)) {
            elements.push([[this, this.result]])
        }

        this.assigns?.forEach(assign => {
            if (condition(assign[0])) {
                elements.push([[this, assign[0]]]);
            }
        });

        return elements;
    }

    searchObject(objectValue) {
        if (this.result instanceof ObjectValue && this.result.isLowerVersion(objectValue)) {
            return [this, this.result.version];
        }

        for (let assign of this.assigns) {
            if (assign[0] instanceof ObjectValue && assign[0].isLowerVersion(objectValue)) {
                return [this, assign[0].version];
            }
        }
    }

    inlineLoops() {
        return this;
    }
}

export class AssignmentExpressionTrace extends TraceElement {
    constructor(lineNumber = 0, content = "", parent = undefined, assigns = undefined) {
        super(lineNumber, content, parent);
        this.assigns = assigns;
    }

    append(trace) {
        const contentFragment = document.createElement('span');
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
        this.element = contentFragment;
    }

    searchObject2(condition) {
        let elements = [];

        this.assigns?.forEach(assign => {
            if (condition(assign[0])) {
                elements.push([[this, assign[0]]]);
            }
        });

        return elements;
    }

    searchObject(objectValue) {
        for (let assign of this.assigns) {
            if (assign[0] instanceof ObjectValue && assign[0].isLowerVersion(objectValue)) {
                return [this, assign[0].version];
            }
        }
    }

    inlineLoops() {
        return this;
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber = "", content = [], parent = undefined, name = "", args = [], returnVal = null, isVoid = false, isExternal = false) {
        super(lineNumber, content, parent);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
        this.isVoid = isVoid;
        this.isExternal = isExternal;
        this.triangle = undefined;
    }

    append(trace) {
        const isHidden = trace.blockStack.length > 1;

        const header = this.createHeaderFragment();
        if (this.content.length === 0) {
            trace.addLine(this.lineNumber, header, null, isHidden);
        } else {
            this.triangle = trace.createBlock(this.lineNumber, header, isHidden);

            for (let traceElem of this.content) {
                traceElem.append(trace);
            }

            trace.closeBlock();
        }
        this.element = header;
    }

    createHeaderFragment() {
        const headerFragment = document.createElement('span');

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

    searchObject2(condition) {
        let elements = []

        if (condition(this.returnVal)) {
            elements.push([[this, this.returnVal]]);
        }

        for (let arg of this.args) {
            if (condition(arg)) {
                elements.push([[this, arg]]);
            }
        }

        for (let traceElem of this.content) {
            const res = traceElem.searchObject2(condition);
            if (res.length > 0) {
                elements = elements.concat(res);
            }
        }

        return elements;
    }

    searchObject(objectValue) {
        const elements = []

        if (this.returnVal instanceof ObjectValue && this.returnVal.isLowerVersion(objectValue)) {
            elements.push([this, this.returnVal.version]);
        }

        for (let arg of this.args) {
            if (arg instanceof ObjectValue && arg.isLowerVersion(objectValue)) {
                elements.push([this, arg.version]);
            }
        }

        for (let traceElem of this.content) {
            const res = traceElem.searchObject(objectValue);
            if (res) {
                elements.push(res);
            }
        }

        if (elements.length === 0) return undefined;
        return elements.reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)
    }

    inlineLoops() {
        return super.inlineLoops();
    }
}

export class LoopTrace extends TraceElement {
    constructor(lineNumber = 0, content = [], parent = undefined, line = "", initialStatement = undefined, incrementationStatement = []) {
        super(lineNumber, [], parent);
        this.line = line;
        this.initialStatement = initialStatement;
        this.incrementationStatement = incrementationStatement;
        this.triangle = undefined;
    }

    append(trace) {
        const header = document.createElement('span');
        header.appendChild(TraceSpan.wrapKeywords(this.line));

        this.triangle = trace.createBlock(this.lineNumber, header, true);

        if (this.initialStatement) {
            this.initialStatement.content.forEach(e => e.append(trace));
        }

        for (let i = 0; i < this.content.length; i++) {
            const loopIteration = this.content[i];
            loopIteration.append(trace);

            if (this.incrementationStatement[i]) {
                this.incrementationStatement[i].forEach(e => e.append(trace));
            }
        }

        trace.closeBlock();

        this.element = header;
    }

    inlineLoops() {
        throw new Error("Should not be called");
    }

    searchObject2(condition) {
        let elements = []

        if (this.initialStatement) {
            const val = this.initialStatement.searchObject2(condition);
            if (val) elements = elements.concat(val);
        }

        if (this.incrementationStatement) {
            this.incrementationStatement.forEach(incrementationStatement => {
                incrementationStatement.forEach(incr => {
                    const val = incr.searchObject2(condition);
                    if (val.length > 0) elements = elements.concat(val);
                });
            });
        }

        if (this.content) {
            this.content.forEach(loopIteration => {
                const val = loopIteration.searchObject2(condition);
                if (val.length > 0) elements = elements.concat(val);
            });
        }

        return elements;
    }

    searchObject(objectValue) {
        let elements = []

        if (this.initialStatement) {
            const val = this.initialStatement.searchObject(objectValue)
            if (val) elements.push(val);
        }

        if (this.incrementationStatement) {
            this.incrementationStatement.forEach(incrementationStatement => {
                incrementationStatement.forEach(incr => {
                    const val = incr.searchObject(objectValue);
                    if (val) elements.push(val);
                });
            });
        }

        if (this.content) {
            this.content.forEach(loopIteration => {
                const val = loopIteration.searchObject(objectValue);
                if (val) elements.push(val);
            });
        }

        if (elements.length === 0) return undefined;
        return elements.reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)
    }
}

export class LoopIterationTrace extends TraceElement {
    constructor(
        lineNumber = 0, content = [], parent = undefined,
        line = "", iteration = 0, conditionalStatement = []
    ) {
        super(lineNumber, content, parent);

        this.line = line;
        this.iteration = iteration;
        this.conditionalStatement = conditionalStatement;
        this.triangle = undefined;
    }

    append(trace) {
        if (this.conditionalStatement.length > 1) {
            this.conditionalStatement.slice(0, this.conditionalStatement.length - 1).forEach(e => e.append(trace));
        }

        const line = document.createElement('span');
        const condition = this.conditionalStatement[this.conditionalStatement.length - 1];

        const iterationSpan = document.createElement('span');
        iterationSpan.append(document.createTextNode('i' + this.iteration));
        iterationSpan.classList.add('loopIteration');
        line.append(iterationSpan);
        line.append(TraceSpan.wrapKeywords(this.line));

        line.append(document.createTextNode(' -> '));

        const iterCondSpan = document.createElement('span');
        iterCondSpan.classList.add('loopIterationCondition');
        iterCondSpan.appendChild(TraceSpan.wrapKeywords(condition.content));

        line.append(iterCondSpan);
        line.append(document.createTextNode(' -> '));
        line.append(condition.result.documentFragment(TraceSpanType.ReturnValuePrimitive));

        if (!this.content || this.content.length === 0) {
            trace.addLine(this.lineNumber, line);
        } else {
            this.triangle = trace.createBlock(this.lineNumber, line, true);
            this.content.forEach(e => e.append(trace));
            trace.closeBlock();
        }
        this.element = line;
    }

    inlineLoops() {
        throw new Error("Should not be called");
    }

    searchObject2(condition) {
        let elements = []

        for (let conditional of this.conditionalStatement) {
            const val = conditional.searchObject2(condition);
            if (val.length > 0) elements = elements.concat(val);
        }

        for (let traceElem of this.content) {
            const val = traceElem.searchObject2(condition);
            if (val.length > 0) elements = elements.concat(val);
        }

        return elements;
    }

    searchObject(objectValue) {
        let elements = []

        if (this.conditionalStatement) {
            this.conditionalStatement.forEach(conditional => {
                const val = conditional.searchObject(objectValue);
                if (val) elements.push(val);
            });
        }

        if (this.content) {
            this.content.forEach(traceElem => {
                const val = traceElem.searchObject(objectValue);
                if (val) elements.push(val);
            });
        }

        if (elements.length === 0) return undefined;
        return elements.reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)
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
                return [field.identifier.name, new ObjectPointer(
                    field.value.className.className,
                    field.value.pointer,
                    field.value.version,
                    objectData
                )];
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
            this.dataType + ": $" + this.shortPointer()
        );
        span.addEventListener('click', () => {pw.openInspectorTab('objectInspector');
            ObjectInspector.instance.add(this);
        });
        df.appendChild(span);
        return df;
    }

    isLowerVersion(object) {
        if (object instanceof ObjectValue) {
            return this.pointer === object.pointer && this.version >= object.version;
        }

        return false;
    }

    shortPointer() {
        return this.pointer.toString().slice(-3);
    }
}

export class ObjectPointer extends Value {
    constructor(dataType = "", pointer = null, version = 0, states = []) {
        super(dataType);
        this.pointer = pointer;
        this.version = version;
        this.states = states;
    }

    getObjValue(objectData) {
        return new ObjectValue(
            this.dataType,
            this.pointer,
            this.version,
            Value.newFieldsValue(objectData.getLastVersion(this.pointer, this.version).fields, objectData),
            this.states);
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {
        return this.getObjValue(this.states).documentFragment(traceSpanType);
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

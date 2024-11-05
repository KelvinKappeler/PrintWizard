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
        lineFragment.appendChild(document.createTextNode(this.line));
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
        contentFragment.appendChild(document.createTextNode(this.content));

        if (this.result) {
            contentFragment.appendChild(document.createTextNode(" -> "));
            const returnValFragment = this.result.documentFragment();
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
            contentFragment.appendChild(assign[0].documentFragment());

            if (index < this.assigns.length - 1) {
                contentFragment.appendChild(document.createTextNode(" / "));
            }
        });

        trace.addLine(this.lineNumber, contentFragment);
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber = "", content = [], name = "", args = [], returnVal = null, isVoid = false) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
        this.isVoid = isVoid;
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
            const fragment = arg.documentFragment(TraceSpanType.ArgsValue);
            headerFragment.appendChild(fragment);

            if (index < this.args.length - 1) {
                headerFragment.appendChild(document.createTextNode(", "));
            }
        });
        headerFragment.appendChild(TraceSpan.createSpan(TraceSpanType.Parenthesis, ')'));

        if (this.returnVal) {
            const returnValFragment = this.returnVal.documentFragment();
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

    static newValue(element) {
        if (element.dataType === 'instanceRef') {
            return new ObjectValue(
                element.className.className,
                element.pointer,
                element.value
            );
        } else {
            return new PrimitiveValue(element.dataType, element.value);
        }
    }
}

class ObjectValue extends Value {
    constructor(dataType = "", pointer = null, value = "") {
        super(dataType);
        this.pointer = pointer;
        this.value = value;
    }

    documentFragment(traceSpanType = TraceSpanType.ReturnValue) {
        const df = document.createDocumentFragment();
        const span = TraceSpan.createSpan(
            traceSpanType,
            this.dataType + ": $" + this.pointer
        );
        span.addEventListener('click', () => {
            ObjectInspector.update(this);
        });
        df.appendChild(span);
        return df;
    }
}

class PrimitiveValue extends Value {
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

/*
export class LoopTrace extends TraceElement {
    constructor(lineNumber, content, iterations) {
        super(lineNumber, content);
        this.iterations = iterations;
    }

    append(lineNumbersFragment, trianglesFragment, traceContentFragment) {
        let traceBlock = new TraceBlock(parentTraceBlock, false);
        let headerLine = new HeaderTraceLine(this.lineNumber, "for (" + this.content + ") {", traceBlock, parentTraceBlock);
        traceBlock.setHeaderLine(headerLine);
        traceBlock.show();

        for (let iter of this.iterations) {
            iter.show(traceBlock);
        }

        traceBlock.addTraceLine(new TraceLine("-", "}", traceBlock, true));
    }
}

export class LoopIteration extends TraceElement {
    constructor(lineNumber, content, currentCondition) {
        super(lineNumber, content);
        this.currentCondition = currentCondition;
    }

    append(lineNumbersFragment, trianglesFragment, traceContentFragment) {
        let traceBlock = new TraceBlock(parentTraceBlock, true);
        let headerLine = new HeaderTraceLine(this.lineNumber, "for (" + this.currentCondition + ") {", traceBlock, parentTraceBlock);
        traceBlock.setHeaderLine(headerLine);
        traceBlock.show();

        for (let traceElem of this.content) {
            traceElem.show(traceBlock);
        }

        traceBlock.addTraceLine(new TraceLine("-", "}", traceBlock, true));
    }
}

export class ConditionalTrace extends TraceElement {
    constructor(lineNumber, content, currentCondition) {
        super(lineNumber, content);
        this.currentCondition = currentCondition;
    }

    append(lineNumbersFragment, trianglesFragment, traceContentFragment) {
        let traceBlock = new TraceBlock(parentTraceBlock, false);
        let headerLine = new HeaderTraceLine(this.lineNumber, "if (" + this.currentCondition + ") {", traceBlock, parentTraceBlock);
        traceBlock.setHeaderLine(headerLine);
        traceBlock.show();

        for (let traceElem of this.content) {
            traceElem.show(traceBlock);
        }

        traceBlock.addTraceLine(new TraceLine("-", "}", traceBlock, true));
    }
}
*/

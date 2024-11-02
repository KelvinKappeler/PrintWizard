import {Trace} from "./trace.js";

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
        trace.addLine(this.lineNumber, contentFragment);
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber = "", content = [], name = "", args = [], returnVal = null) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
    }

    append(trace) {
        const isHidden = trace.blockStack.length > 1;
        trace.createBlock(this.lineNumber, this.createHeaderFragment(), isHidden);

        for (let traceElem of this.content) {
            traceElem.append(trace);
        }

        trace.closeBlock();
    }

    createHeaderFragment() {
        const headerFragment = document.createDocumentFragment();

        headerFragment.appendChild(Trace.createSpan('functionName', this.name));
        headerFragment.appendChild(Trace.createSpan('parenthesis', '('));
        headerFragment.appendChild(document.createTextNode(this.args.map(arg => arg.value).join(", ")));
        headerFragment.appendChild(Trace.createSpan('parenthesis', ')'));

        const returnVal = this.returnVal ? this.returnVal.value : "";
        if (returnVal) {
            headerFragment.appendChild(document.createTextNode(" -> "));
            headerFragment.appendChild(Trace.createSpan('returnValue', returnVal));
        }

        return headerFragment;
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

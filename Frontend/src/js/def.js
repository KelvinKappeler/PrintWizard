import {HeaderTraceLine, TraceBlock, TraceLine} from "./trace.js";

class TraceElement {
    constructor(lineNumber, content) {
        this.lineNumber = lineNumber;
        this.content = content;
    }

    show(parentTraceBlock) {}
}

export class StepTrace extends TraceElement {
    constructor(lineNumber = 0, content = "", objects = []) {
        super(lineNumber, content);
        this.objects = objects;
    }

    show(parentTraceBlock) {
        parentTraceBlock.addTraceLine(new TraceLine(this.lineNumber, this.content, parentTraceBlock));
    }
}

export class InstantiationTrace extends TraceElement {
    constructor(lineNumber, content, name, type, args) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
    }
}

export class StatementTrace extends TraceElement {
    constructor(id, lineNumber = 0, content = []) {
        super(lineNumber, content);
        this.id = id;
    }

    show(parentTraceBlock) {

        this.content[0].show(parentTraceBlock);
        /*for (let traceElem of this.content) {
            traceElem.show(parentTraceBlock);
        }*/
    }
}

export class SubStatementTrace extends TraceElement {
    constructor(id, lineNumber = 0, content = []) {
        super(lineNumber, content);
        this.id = id;
    }

    show(parentTraceBlock) {
        this.content[0].show(parentTraceBlock);
        /*
        for (let traceElem of this.content) {
            traceElem.show(parentTraceBlock);
        }*/
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber = 0, content = [], name = "", args = [], returnVal = null) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
    }

    show(parentTraceBlock) {
        let traceBlock = new TraceBlock(parentTraceBlock, false);
        let headerLine = new HeaderTraceLine(this.lineNumber, this.name + "(" + this.args.join(", ") + ") {", traceBlock, parentTraceBlock);
        traceBlock.setHeaderLine(headerLine);
        traceBlock.show();

        for (let traceElem of this.content) {
            traceElem.show(traceBlock);
        }

        traceBlock.addTraceLine(new TraceLine("-", "}", traceBlock, true));
    }
}

export class LoopTrace extends TraceElement {
    constructor(lineNumber, content, iterations) {
        super(lineNumber, content);
        this.iterations = iterations;
    }

    show(parentTraceBlock) {
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

    show(parentTraceBlock) {
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

    show(parentTraceBlock) {
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

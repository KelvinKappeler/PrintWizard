class TraceElement {
    constructor(lineNumber, content, depth) {
        this.lineNumber = lineNumber;
        this.content = content;
        this.depth = depth;
    }

    show(traceArea) {}
}

export class Statement extends TraceElement {
    constructor(lineNumber, content, depth, objects) {
        super(lineNumber, content, depth);
        this.objects = objects;
    }

    show(traceArea) {
        traceArea.addLine(this.lineNumber, "  ".repeat(this.depth) + this.content, false);
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber, content, depth, name, args, returnVal) {
        super(lineNumber, content, depth);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
    }

    show(traceArea) {
        traceArea.addLine(this.lineNumber, "  ".repeat(this.depth) + this.name + " {", true);

        for (let statement of this.content) {
            statement.show(traceArea);
        }

        traceArea.addLine("-", "  ".repeat(this.depth) + "}", false);
    }
}

export class Loop extends TraceElement {

}

export class Conditional extends TraceElement {

}
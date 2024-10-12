export class Parents {
    constructor(lineNumbers, triangles, traceContent) {
        this.lineNumbers = lineNumbers;
        this.triangles = triangles;
        this.traceContent = traceContent;
    }
}

class TraceElement {
    constructor(lineNumber, content) {
        this.lineNumber = lineNumber;
        this.content = content;
    }

    show(traceArea, parents = null, depth = 0) {}
}

export class Statement extends TraceElement {
    constructor(lineNumber, content, objects) {
        super(lineNumber, content);
        this.objects = objects;
    }

    show(traceArea, parents = null, depth = 0) {
        traceArea.addLine(this.lineNumber, "  ".repeat(depth) + this.content, parents);
    }
}

export class FunctionTrace extends TraceElement {
    constructor(lineNumber, content, name, args, returnVal) {
        super(lineNumber, content);
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
    }

    show(traceArea, parents = null, depth = 0) {
        const child = traceArea.createParents();
        traceArea.addLine(this.lineNumber, "  ".repeat(depth) + this.name + " {", parents, child);
        traceArea.addParents(parents, child);

        for (let statement of this.content) {
            statement.show(traceArea, child, depth + 1);
        }

        traceArea.addLine("-", "  ".repeat(depth) + "}", child);
    }
}

export class LoopTrace extends TraceElement {
    constructor(lineNumber, content, iterations) {
        super(lineNumber, content);
        this.iterations = iterations;
    }

    show(traceArea, parents, depth = 0) {
        const child = traceArea.createParents();
        traceArea.addLine(this.lineNumber, "  ".repeat(depth) + this.content + " {", parents, child);
        traceArea.addParents(parents, child)

        for (let iteration of this.iterations) {
            iteration.show(traceArea, child, depth + 1);
        }

        traceArea.addLine("-", "  ".repeat(depth) + "}", child);
    }

}

export class LoopIteration extends TraceElement {
    constructor(lineNumber, content, currentCondition) {
        super(lineNumber, content);
        this.currentCondition = currentCondition;
    }

    show(traceArea, parents, depth = 0) {
        const child = traceArea.createParents(true);
        traceArea.addLine(this.lineNumber, "  ".repeat(depth) + this.currentCondition + " {", parents, child);
        traceArea.addParents(parents, child);

        for (let statement of this.content) {
            statement.show(traceArea, child, depth + 1);
        }

        traceArea.addLine("-", "  ".repeat(depth) + "}", child);
    }
}

export class ConditionalTrace extends TraceElement {

}
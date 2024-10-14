export class EventTrace {
    constructor() {}
}

export class Statement extends EventTrace {
    constructor(eventId, children) {
        super();
        this.eventId = eventId;
        this.children = children;
    }
}

export class SubStatement extends EventTrace {
    constructor(eventId, children) {
        super();
        this.eventId = eventId;
        this.children = children;
    }
}

export class FunctionContext extends EventTrace {
    constructor(eventId, name, children)
    {
        super();
        this.eventId = eventId;
        this.name = name;
        this.children = children;
    }
}

/*
a.foo(A.number1()).bar(A.number2()) { -> obj2
    .foo(A.number1()) { -> obj1
        A.number1() { -> 1
            return 1 -> 1
        }
        return obj1
    }
    .bar (A.number2()) {
        A.number2() { -> 1
            return 1 -> 1
        }
        return obj2
    }
}

FunctionTrace(content = FunctionTrace(), return = FunctionTrace(content = FunctionTrace))



a.foo(A.number1() -> RETURN_VALUE) -> RETURN_VALUE


//FunctionTrace = Appel à une function
//InstantiationTrace = Instancie un objet ou variable
//AccessTrace = Accès à une variable ou objet
//ObjectTrace = Définition d'un objet
id => type, fieldsvalue, version
//A.field1
//A.function1()

*/

// Base class for all trace events
class TraceEvent {
    constructor(event) {
        this.eventType = event.eventType;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    // Override in subclasses for specific rendering
    show(parentTraceBlock) {}
}

// Class for GroupEvents
class GroupEvent extends TraceEvent {
    constructor(event) {
        super(event);
        this.eventId = event.eventId;
        this.pos = event.pos;
        this.kind = event.kind;
    }

    show(parentTraceBlock) {
        let traceBlock = new TraceBlock(parentTraceBlock, false);
        let headerText = this.getHeaderText();
        let headerLine = new HeaderTraceLine(this.eventId, headerText, traceBlock, parentTraceBlock);
        traceBlock.setHeaderLine(headerLine);
        traceBlock.show();

        for (let child of this.children) {
            child.show(traceBlock);
        }

        traceBlock.addTraceLine(new TraceLine("-", "}", traceBlock, true));
    }

    getHeaderText() {
        switch (this.eventType) {
            case 'controlFlow':
                return `Function ${this.kind.functionName} {`;
            case 'statement':
                return `Statement {`;
            case 'subStatement':
                return `SubStatement {`;
            default:
                return `{`;
        }
    }
}

// Class for ExecutionSteps
class ExecutionStep extends TraceEvent {
    constructor(event) {
        super(event);
        this.stepId = event.stepId;
        this.nodeKey = event.nodeKey;
        this.argsValues = event.argsValues;
        this.kind = event.kind;
        this.result = event.result;
    }

    show(parentTraceBlock) {
        let content = this.getContent();
        parentTraceBlock.addTraceLine(new TraceLine(this.stepId, content, parentTraceBlock));
    }

    getContent() {
        switch (this.kind) {
            case 'logCall':
                return `Call: ${this.nodeKey}(${this.argsValues.join(", ")})`;
            case 'logReturn':
                return `Return: ${JSON.stringify(this.result)}`;
            case 'expressionWithoutReturn':
                return `Expression: ${this.nodeKey}`;
            default:
                return `${this.kind}: ${this.nodeKey}`;
        }
    }
}

// Parser function to build the tree
function parseEventTrace(eventTrace) {
    let stack = [];
    let root = new TraceEvent({ eventType: 'root' });
    stack.push(root);

    for (let event of eventTrace) {
        if (event.type === 'GroupEvent') {
            if (event.pos === 'start') {
                let groupEvent = new GroupEvent(event);
                stack[stack.length - 1].addChild(groupEvent);
                stack.push(groupEvent);
            } else if (event.pos === 'end') {
                stack.pop();
            }
        } else if (event.type === 'ExecutionStep') {
            let executionStep = new ExecutionStep(event);
            stack[stack.length - 1].addChild(executionStep);
        }
    }

    return root;
}

// Usage example
let eventTraceData = /* your eventTrace.json data */;
let rootEvent = parseEventTrace(eventTraceData.trace);
rootEvent.show(null); // Start rendering from the root

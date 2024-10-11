class TraceElement {
}

export class FunctionTrace extends TraceElement {
    constructor(name, args, returnVal, line, content) {
        super();
        this.name = name;
        this.args = args;
        this.returnVal = returnVal;
        this.line = line;
        this.content = content;
    }
}
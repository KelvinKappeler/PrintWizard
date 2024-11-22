import {Triangle} from "./Elements/Triangle.js";

/**
 * This class is used to show the trace of the program execution.
 */
export class Trace {
    static lineNumbersArea = document.querySelector('.lineNumbers');
    static trianglesArea = document.querySelector('.traceTriangles');
    static traceContentArea = document.querySelector('.traceContent');
    static space = "  ";

    constructor(treeTrace) {
        this.treeTrace = treeTrace;

        this.blockStack = [new StackFragment(
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'))
        ];
    }

    getLastBlock() {
        return this.blockStack[this.blockStack.length - 1];
    }

    show() {
        Trace.lineNumbersArea.innerHTML = '';
        Trace.trianglesArea.innerHTML = '';
        Trace.traceContentArea.innerHTML = '';

        this.treeTrace.append(this);

        Trace.lineNumbersArea.appendChild(this.blockStack[0].linesNumber);
        Trace.trianglesArea.appendChild(this.blockStack[0].triangles);
        Trace.traceContentArea.appendChild(this.blockStack[0].traceContent);
    }

    createBlock(lineNumber, headerFragment, isHidden) {
        const newBlock = new StackFragment(
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        );

        this.addLine(lineNumber, headerFragment, newBlock, isHidden);

        newBlock.linesNumber.classList.add('lineNumberBlock');
        newBlock.triangles.classList.add('trianglesBlock');
        newBlock.traceContent.classList.add('codeBlocks');

        if (isHidden) {
            newBlock.linesNumber.classList.add('hidden');
            newBlock.triangles.classList.add('hidden');
            newBlock.traceContent.classList.add('hidden');
        }

        this.blockStack.push(newBlock);
    }

    closeBlock() {
        const bs = this.blockStack.pop();
        const lastBlock = this.getLastBlock();
        lastBlock.linesNumber.appendChild(bs.linesNumber);
        lastBlock.triangles.appendChild(bs.triangles);
        lastBlock.traceContent.appendChild(bs.traceContent);
    }

    addLine(lineNumber, contentFragment, newBlock = null, isNewBlockHidden = false) {
        const lastBlock = this.getLastBlock();
        lastBlock.linesNumber.appendChild(document.createTextNode(lineNumber));
        lastBlock.linesNumber.appendChild(document.createElement('br'));

        contentFragment.prepend(document.createTextNode(Trace.space.repeat(this.blockStack.length - 1)));
        lastBlock.traceContent.appendChild(contentFragment);
        lastBlock.traceContent.appendChild(document.createElement('br'));

        if (newBlock) {
            let triangle = new Triangle([newBlock.linesNumber, newBlock.traceContent, newBlock.triangles], isNewBlockHidden);
            triangle.attachTo(lastBlock.triangles);
        }
        lastBlock.triangles.appendChild(document.createElement('br'));

    }
}

class StackFragment {
    constructor(linesNumber, triangles, traceContent) {
        this.linesNumber = linesNumber;
        this.triangles = triangles
        this.traceContent = traceContent;
    }
}

export class TraceSpanType {
    static Parenthesis = new TraceSpanType("parenthesis");
    static ReturnValue = new TraceSpanType("returnValue");
    static ReturnValuePrimitive = new TraceSpanType("returnValuePrimitive");
    static FunctionName = new TraceSpanType("functionName");
    static ArgsValue = new TraceSpanType("argsValue");
    static ArgsValuePrimitive = new TraceSpanType("argsValuePrimitive");
    static Keywords = new TraceSpanType("keywords");

    constructor(name) {
        this.name = name;
    }
}

export class TraceSpan {
    static keywords = [
        "abstract", "continue", "for", "new", "switch",
        "default", "do", "if", "private", "this",
        "break", "double", "implements", "protected", "throw",
        "byte", "else", "import", "public", "throws",
        "case", "enum", "instanceof", "return", "transient",
        "catch", "extends", "int", "short", "try",
        "char", "final", "interface", "static", "void",
        "class", "finally", "long", "volatile", "float",
        "native", "super", "while"
    ];

    static createSpan(category, textContent) {
        const span = document.createElement('span');
        span.classList.add(category.name);
        span.appendChild(document.createTextNode(textContent));

        return span;
    }

    static wrapKeywords(line) {
        const fragment = document.createDocumentFragment();
        const regex = new RegExp(`(\\b(?:${TraceSpan.keywords.join("|")})(?=\\W|$)|[()])`, 'g');

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
            const matchedText = match[0];

            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(line.slice(lastIndex, match.index)));
            }

            if (TraceSpan.keywords.includes(matchedText)) {
                fragment.appendChild(TraceSpan.createSpan(TraceSpanType.Keywords, matchedText));
            } else if (matchedText === '(' || matchedText === ')') {
                fragment.appendChild(TraceSpan.createSpan(TraceSpanType.Parenthesis, matchedText));
            }

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
            fragment.appendChild(document.createTextNode(line.slice(lastIndex)));
        }

        return fragment;
    }
}

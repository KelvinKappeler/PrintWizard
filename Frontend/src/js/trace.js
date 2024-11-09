import {createTriangle, foldTriangle, toggleTriangle} from "./triangle.js";

export class Trace {
    static lineNumbersArea = document.querySelector('.lineNumbers');
    static trianglesArea = document.querySelector('.traceTriangles');
    static traceContentArea = document.querySelector('.traceContent');
    static space = "  ";

    constructor(treeTrace) {
        this.treeTrace = treeTrace;

        this.blockStack = [new StackFragment(
            document.createDocumentFragment(),
            document.createDocumentFragment(),
            document.createDocumentFragment())
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
            let triangle = createTriangle();
            lastBlock.triangles.appendChild(triangle);
            triangle.addEventListener('click', () => {
                toggleTriangle(triangle, newBlock);
            });

            if (isNewBlockHidden) {
                foldTriangle(triangle, newBlock);
            }
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
    static FunctionName = new TraceSpanType("functionName");
    static ArgsValue = new TraceSpanType("argsValue");

    constructor(name) {
        this.name = name;
    }
}

export class TraceSpan {
    static createSpan(category, textContent) {
        const span = document.createElement('span');
        span.classList.add(category.name);
        span.appendChild(document.createTextNode(textContent));

        return span;
    }
}

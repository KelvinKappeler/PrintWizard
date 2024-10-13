import {createTriangle, foldTriangle, toggleTriangle} from "./triangle.js";
import {FunctionTrace, LoopIteration, LoopTrace, Statement, ConditionalTrace} from "./def.js";

export class TraceBlock {
    static lineNumbersArea = document.querySelector('.lineNumbers');
    static trianglesArea = document.querySelector('.traceTriangles');
    static traceContentArea = document.querySelector('.traceContent');

    constructor(parentTraceBlock = null, isHidden = false) {
        this.parentTraceBlock = parentTraceBlock;
        this.parentLineNumbersDiv = parentTraceBlock ? parentTraceBlock.lineNumbersDiv : TraceBlock.lineNumbersArea;
        this.parentTrianglesDiv = parentTraceBlock ? parentTraceBlock.trianglesDiv : TraceBlock.trianglesArea;
        this.parentTraceContentDiv = parentTraceBlock ? parentTraceBlock.traceContentDiv : TraceBlock.traceContentArea;
        this.contentTrace = [];
        this.depth = parentTraceBlock ? parentTraceBlock.depth + 1 : 0;
        this.isHidden = isHidden;
        this.headerLine = null;

        this.createElements();
    }

    setHeaderLine(headerLine) {
        this.headerLine = headerLine;
    }

    createElements() {
        this.lineNumbersDiv = document.createElement('div');
        this.lineNumbersDiv.classList.add('lineNumberBlock');

        this.trianglesDiv = document.createElement('div');
        this.trianglesDiv.classList.add('trianglesBlock');

        this.traceContentDiv = document.createElement('div');
        this.traceContentDiv.classList.add('codeBlocks');

        if (this.isHidden) {
            this.lineNumbersDiv.classList.add('hidden');
            this.trianglesDiv.classList.add('hidden');
            this.traceContentDiv.classList.add('hidden');
        }
    }

    show() {
        this.headerLine.show(this.isHidden);
        this.parentLineNumbersDiv.appendChild(this.lineNumbersDiv);
        this.parentTrianglesDiv.appendChild(this.trianglesDiv);
        this.parentTraceContentDiv.appendChild(this.traceContentDiv);
    }

    addTraceLine(traceLine) {
        this.contentTrace.push(traceLine);
        traceLine.show();
    }
}

export class TraceLine {
    static space = "  ";

    constructor(lineNumber, content, parentTraceBlock = null, isEndOfBlock = false) {
        this.parentTraceBlock = parentTraceBlock;
        this.lineNumber = lineNumber;
        this.content = content;
        this.isEndOfBlock = isEndOfBlock;

        this.numberDiv = this.parentTraceBlock ? this.parentTraceBlock.lineNumbersDiv : TraceBlock.lineNumbersArea;
        this.trianglesDiv = this.parentTraceBlock ? this.parentTraceBlock.trianglesDiv : TraceBlock.trianglesArea;
        this.contentDiv = this.parentTraceBlock ? this.parentTraceBlock.traceContentDiv : TraceBlock.traceContentArea;
    }

    show() {
        this.numberDiv.appendChild(document.createTextNode(this.lineNumber));
        this.numberDiv.appendChild(document.createElement('br'));

        const depthModifier = this.isEndOfBlock ? 0 : 1;
        let textNode = document.createTextNode(TraceLine.space.repeat(this.parentTraceBlock ? this.parentTraceBlock.depth + depthModifier : 0) + this.content);
        this.contentDiv.appendChild(textNode);
        this.contentDiv.appendChild(document.createElement('br'));
        this.contentNode = textNode;

        this.trianglesDiv.appendChild(document.createElement('br'));
    }
}

export class HeaderTraceLine extends TraceLine {
    constructor(lineNumber, content, childTraceBlock, parentTraceBlock = null) {
        super(lineNumber, content, parentTraceBlock);
        this.childTraceBlock = childTraceBlock;
    }

    show(isFolded = false) {
        let triangle = createTriangle();
        this.trianglesDiv.appendChild(triangle);
        triangle.addEventListener('click', () => {
            toggleTriangle(triangle, this);
        });
        super.show();
        if (isFolded) {
            foldTriangle(triangle, this);
        }
    }

    setContent(content) {
        this.content = content;
        this.contentNode.textContent = TraceLine.space.repeat(this.parentTraceBlock ? this.parentTraceBlock.depth + 1: 0) + content;
    }
}

window.addEventListener('load', function() {
    let testLoop = new LoopTrace(12, "int j = 0; j++; j<3", [
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ], "j:0 < 3"),
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ],  "j:1 < 3"),
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ],  "j:2 < 3"),
        new LoopIteration(13, [],  "j:3 < 3")
    ])

    let statements = [
        new Statement(2, "System.out.println(\"test\")", []),
        new FunctionTrace(9, [
            new Statement(10, "int i = 0;", []),
            new Statement(11, "i++;", []),
            testLoop
        ], "testFunction", [], null),
        new ConditionalTrace(16, [
            new Statement(17, "System.out.println(\"Hello World!\");", [])
        ], "i == 0")
    ];
    let ft2 = new FunctionTrace(1, statements, "main", [], null);
    ft2.show(null);
});
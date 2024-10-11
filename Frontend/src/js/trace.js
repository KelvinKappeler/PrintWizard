import {FunctionTrace, Statement} from './def.js';

const lineNumbersAreaSelector = '.lineNumbers';
const trianglesAreaSelector = '.traceTriangles';
const traceContentAreaSelector = '.traceContent';

export class TraceArea {
    constructor(lineNumbersArea, trianglesArea, traceContentArea) {
        this.lineNumbersArea = new LineNumbersArea(lineNumbersArea);
        this.trianglesArea = new TrianglesArea(trianglesArea);
        this.traceContentArea = new TraceContentArea(traceContentArea);
    }

    addLine(lineNumber, content, canFold) {
        this.lineNumbersArea.addLine(lineNumber);
        this.traceContentArea.addContent(content);
        this.trianglesArea.addTriangle(canFold);
    }
}

export class LineNumbersArea {
    constructor(selector) {
        this.lineNumbers = document.querySelector(selector);
    }

    addLine(lineNumber) {
        this.lineNumbers.appendChild(document.createTextNode(lineNumber));
        this.lineNumbers.appendChild(document.createElement('br'));
    }
}

export class TrianglesArea {
    constructor(selector) {
        this.triangles = document.querySelector(selector);
    }

    addTriangle(canFold) {
        if (canFold) {
            let triangle = document.createElement('i');
            triangle.classList.add('bi');
            triangle.classList.add('bi-chevron-down');
            this.triangles.appendChild(triangle);
            this.triangles.appendChild(document.createElement('br'));
        } else {
            this.triangles.appendChild(document.createElement('br'));
        }
    }

}

export class TraceContentArea {
    constructor(selector) {
        this.lineContent = document.querySelector(selector)
    }

    addContent(lineContent) {
        this.lineContent.appendChild(document.createTextNode(lineContent))
        this.lineContent.appendChild(document.createElement('br'))
    }
}

window.addEventListener('load', function() {
    let statements = [
        new Statement(2, "System.out.println(\"test\")", 1, []),
        new FunctionTrace(9, [
            new Statement(10, "int i = 0;", 3, []),
            new Statement(11, "i++;", 3, []),
        ], 2, "testFunction", null, null),
    ];
    let ft2 = new FunctionTrace(1, statements, 0,  "main", null, null);
    ft2.show(new TraceArea(lineNumbersAreaSelector, trianglesAreaSelector, traceContentAreaSelector));
});
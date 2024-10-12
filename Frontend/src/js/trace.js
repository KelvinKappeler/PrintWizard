import {FunctionTrace, LoopIteration, LoopTrace, Parents, Statement} from './def.js';
import {toggleTriangle} from "./triangle.js";

const lineNumbersAreaSelector = '.lineNumbers';
const trianglesAreaSelector = '.traceTriangles';
const traceContentAreaSelector = '.traceContent';

export class TraceArea {
    constructor(lineNumbersArea, trianglesArea, traceContentArea) {
        this.lineNumbersArea = new LineNumbersArea(lineNumbersArea);
        this.trianglesArea = new TrianglesArea(trianglesArea);
        this.traceContentArea = new TraceContentArea(traceContentArea);
        this.initialParent = new Parents(this.lineNumbersArea.lineNumbers, this.trianglesArea.triangles, this.traceContentArea.lineContent);
    }

    addLine(lineNumber, content, parents, child = null) {
        let newParents = this.initialParent;
        if (parents) {
            newParents = parents;
        }
        this.lineNumbersArea.addLine(lineNumber, newParents.lineNumbers);
        this.traceContentArea.addContent(content, newParents.traceContent);
        this.trianglesArea.addTriangle(newParents, child);
    }

    createParents(hiddenByDefault = false) {
        //Line Numbers
        const lineNumbersDiv = document.createElement('div');
        lineNumbersDiv.classList.add('lineNumberBlock');

        //Triangles
        const trianglesDiv = document.createElement('div');
        trianglesDiv.classList.add('trianglesBlock');

        //Trace
        const traceDiv = document.createElement('div');
        traceDiv.classList.add('codeBlock');

        if (hiddenByDefault) {
            lineNumbersDiv.classList.add('hidden');
            trianglesDiv.classList.add('hidden');
            traceDiv.classList.add('hidden');
        }

        return new Parents(lineNumbersDiv, trianglesDiv, traceDiv);
    }

    addParents(baseParents, newParents) {
        if (!baseParents) {
            baseParents = this.initialParent;
        }

        baseParents.lineNumbers.appendChild(newParents.lineNumbers);
        baseParents.triangles.appendChild(newParents.triangles);
        baseParents.traceContent.appendChild(newParents.traceContent);
    }
}

export class LineNumbersArea {
    constructor(selector) {
        this.lineNumbers = document.querySelector(selector);
    }

    addLine(lineNumber, parent) {
        parent.appendChild(document.createTextNode(lineNumber));
        parent.appendChild(document.createElement('br'));
    }
}

export class TrianglesArea {
    constructor(selector) {
        this.triangles = document.querySelector(selector);
    }

    addTriangle(parents, child) {
        if (child) {
            let triangle = document.createElement('i');
            triangle.classList.add('bi');
            triangle.classList.add('bi-chevron-down');
            let header = parents.traceContent.lastChild.previousSibling;
            if (child.lineNumbers.classList.contains('hidden')) {
                toggleTriangle(triangle, header, child);
            }
            triangle.addEventListener('click', () => {
                toggleTriangle(triangle, header, child);
            })
            parents.triangles.appendChild(triangle);
        }

        parents.triangles.appendChild(document.createElement('br'));
    }

}

export class TraceContentArea {
    constructor(selector) {
        this.lineContent = document.querySelector(selector)
    }

    addContent(lineContent, parent) {
        parent.appendChild(document.createTextNode(lineContent))
        parent.appendChild(document.createElement('br'))
    }
}

window.addEventListener('load', function() {
    let testLoop = new LoopTrace(12, "for(int j = 0; j++; j<3)", [
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ], "for(j:0 < 3)"),
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ],  "for(j:1 < 3)"),
        new LoopIteration(13, [
            new Statement(14, "int x = j", []),
            new Statement(15, "System.out.println(x)", [])
        ],  "for(j:2 < 3)"),
        new LoopIteration(13, [],  "for(j:3 < 3)")
    ])
    let statements = [
        new Statement(2, "System.out.println(\"test\")", []),
        new FunctionTrace(9, [
            new Statement(10, "int i = 0;", []),
            new Statement(11, "i++;", []),
            testLoop
        ], "testFunction", null, null),
    ];
    let ft2 = new FunctionTrace(1, statements,  "main", null, null);
    ft2.show(new TraceArea(lineNumbersAreaSelector, trianglesAreaSelector, traceContentAreaSelector));
});

import {TraceBlock, TraceLine} from "./trace.js";

const iconFold = "bi-chevron-down";
const iconExpanded = "bi-chevron-right";
const closeBracket = "...}";

export function createTriangle() {
    let triangle = document.createElement('i');
    triangle.classList.add('bi');
    triangle.classList.add(iconFold);
    return triangle;
}

export function toggleTriangle(triangle, headerLine) {
    if (!headerLine.childTraceBlock.isHidden) {
        foldTriangle(triangle, headerLine);
        headerLine.childTraceBlock.isHidden = true;
    }
    else {
        triangle.classList.remove(iconExpanded);
        triangle.classList.add(iconFold);

        headerLine.childTraceBlock.lineNumbersDiv.classList.remove('hidden')
        headerLine.childTraceBlock.trianglesDiv.classList.remove('hidden');
        headerLine.childTraceBlock.traceContentDiv.classList.remove('hidden');

        headerLine.setContent(headerLine.content.slice(0, closeBracket.length * -1));
        headerLine.childTraceBlock.isHidden = false;
    }
}

export function foldTriangle(triangle, headerLine) {
    triangle.classList.remove(iconFold);
    triangle.classList.add(iconExpanded);

    headerLine.childTraceBlock.lineNumbersDiv.classList.add('hidden');
    headerLine.childTraceBlock.trianglesDiv.classList.add('hidden');
    headerLine.childTraceBlock.traceContentDiv.classList.add('hidden');

    headerLine.setContent(headerLine.content + closeBracket);
}

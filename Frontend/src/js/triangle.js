const iconFold = "bi-chevron-down";
const iconExpanded = "bi-chevron-right";
const closeBracket = "...}";

export function createTriangle() {
    let triangle = document.createElement('i');
    triangle.classList.add('bi');
    triangle.classList.add(iconFold);
    return triangle;
}

export function toggleTriangle(triangle, traceBlock) {
    if (triangle.classList.contains(iconFold)) {
        foldTriangle(triangle, traceBlock);
    }
    else {
        triangle.classList.remove(iconExpanded);
        triangle.classList.add(iconFold);

        traceBlock.linesNumber.classList.remove('hidden')
        traceBlock.triangles.classList.remove('hidden');
        traceBlock.traceContent.classList.remove('hidden');

        //headerLine.setContent(headerLine.content.slice(0, closeBracket.length * -1));
        //headerLine.childTraceBlock.isHidden = false;
    }
}

export function foldTriangle(triangle, traceBlock) {
    triangle.classList.remove(iconFold);
    triangle.classList.add(iconExpanded);

    traceBlock.linesNumber.classList.add('hidden');
    traceBlock.triangles.classList.add('hidden');
    traceBlock.traceContent.classList.add('hidden');

    //headerLine.setContent(headerLine.content + closeBracket);
}

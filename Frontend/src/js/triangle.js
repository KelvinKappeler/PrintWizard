import { Parents } from "./def.js";

const iconFold = "bi-chevron-down";
const iconExpanded = "bi-chevron-right";
const closeBracket = "...}";

export function toggleTriangle(triangle, header, child) {
    if (triangle.classList.contains(iconFold)) {
        triangle.classList.remove(iconFold);
        triangle.classList.add(iconExpanded);

        child.lineNumbers.classList.add('hidden');
        child.triangles.classList.add('hidden');
        child.traceContent.classList.add('hidden');

        header.textContent += closeBracket;
    }
    else {
        triangle.classList.remove(iconExpanded);
        triangle.classList.add(iconFold);

        child.lineNumbers.classList.remove('hidden')
        child.triangles.classList.remove('hidden');
        child.traceContent.classList.remove('hidden');

        header.textContent = header.textContent.slice(0, closeBracket.length * -1);
    }
}

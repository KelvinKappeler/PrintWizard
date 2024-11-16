const iconFold = "bi-chevron-down";
const iconExpanded = "bi-chevron-right";

export function createTriangle() {
    let triangle = document.createElement('i');
    triangle.classList.add('bi');
    triangle.classList.add(iconFold);
    return triangle;
}

export function toggleTriangle(triangle, divsToToggle) {
    if (triangle.classList.contains(iconFold)) {
        foldTriangle(triangle, divsToToggle);
    }
    else {
        triangle.classList.remove(iconExpanded);
        triangle.classList.add(iconFold);

        divsToToggle.forEach(div => div.classList.remove('hidden'));
    }
}

export function foldTriangle(triangle, divsToToggle) {
    triangle.classList.remove(iconFold);
    triangle.classList.add(iconExpanded);

    divsToToggle.forEach(div => div.classList.add('hidden'));
}

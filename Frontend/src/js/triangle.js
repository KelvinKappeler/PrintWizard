function toggleTriangle(item) {
    const iconFold = "bi-chevron-down";
    const iconExpanded = "bi-chevron-right";

    if (item.classList.contains(iconFold)) {
        item.classList.remove(iconFold);
        item.classList.add(iconExpanded);
    }
    else {
        item.classList.remove(iconExpanded);
        item.classList.add(iconFold);
    }
}

document.querySelectorAll('.traceTriangles i').forEach(item => {
    item.addEventListener('click', event => {
        toggleTriangle(item);
    })
})

const breadcrumb = document.querySelector('.breadcrumb');

/**
 * Add a breadcrumb to the breadcrumb list
 * @param title the title of the breadcrumb
 */
function addBreadcrumb(title) {
    let breadcrumbItem = document.createElement('li');
    breadcrumbItem.innerHTML = title;
    breadcrumb.appendChild(breadcrumbItem);
}

addBreadcrumb("BasicOperation.java");
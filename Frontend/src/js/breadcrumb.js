export class Breadcrumb {
    static breadcrumb = document.querySelector('.breadcrumb');

    /**
     * Add a breadcrumb to the breadcrumb list
     * @param title the title of the breadcrumb
     */
    static add(title) {
        let breadcrumbItem = document.createElement('li');
        breadcrumbItem.innerHTML = title;
        Breadcrumb.breadcrumb.appendChild(breadcrumbItem);
    }

    static clear() {
        Breadcrumb.breadcrumb.innerHTML = '';
    }

    static removeLast() {
        Breadcrumb.breadcrumb.removeChild(Breadcrumb.breadcrumb.lastChild);
    }
}

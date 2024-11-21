import {Preconditions} from "./utils/Preconditions.js";

/**
 * This class is used to create a triangle element that can be used to toggle the visibility of a DOM element.
 */
export class Triangle {
    static iconFold = "bi-chevron-down";
    static iconExpanded = "bi-chevron-right";

    /**
     * Creates a new triangle element that can be used to toggle the visibility of a DOM element.
     * @param elementsToToggle The elements to toggle the visibility of.
     * @param isCollapse Whether the elements are initially expanded or not.
     */
    constructor(elementsToToggle, isCollapse = false) {
        Preconditions.checkArrayOfTypes(elementsToToggle, Node);
        Preconditions.checkIfBoolean(isCollapse);

        this.elementsToToggle = elementsToToggle;
        this.isCollapse = !isCollapse;
        this.triangle = document.createElement('i');
        this.triangle.classList.add('bi');
        this.triangle.addEventListener('click', () => this.toggle());
        this.toggle();
    }

    /**
     * Expands the elements and changes the triangle icon.
     */
    expand() {
        this.triangle.classList.remove(Triangle.iconFold);
        this.triangle.classList.add(Triangle.iconExpanded);
        this.elementsToToggle.forEach(element => element.classList.add('hidden'));
        this.isCollapse = true;
    }

    /**
     * Collapses the elements and changes the triangle icon.
     */
    collapse() {
        this.triangle.classList.remove(Triangle.iconExpanded);
        this.triangle.classList.add(Triangle.iconFold);
        this.elementsToToggle.forEach(element => element.classList.remove('hidden'));
        this.isCollapse = false;
    }

    /**
     * Toggles the visibility of the elements and changes the triangle icon.
     */
    toggle() {
        this.isCollapse ? this.collapse() : this.expand();
    }

    /**
     * Attaches the triangle to a parent element.
     * @param parent The parent element to attach the triangle to.
     */
    attachTo(parent) {
        Preconditions.checkType(parent, Node);
        parent.appendChild(this.triangle);
    }
}

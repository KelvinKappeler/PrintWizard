import {Preconditions} from "../utils/Preconditions.js";
import {PWElement} from "./PWElement.js";

/**
 * This class is used to create a triangle element that can be used to toggle the visibility of a DOM element.
 */
export class Triangle extends PWElement {
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

        const element = document.createElement('i');
        element.classList.add('bi');
        element.addEventListener('click', () => this.toggle());
        super(element);

        this.elementsToToggle = elementsToToggle;
        this.isCollapse = !isCollapse;
        this.toggle();
    }

    /**
     * Expands the elements and changes the triangle icon.
     */
    expand() {
        this.element.classList.remove(Triangle.iconFold);
        this.element.classList.add(Triangle.iconExpanded);
        this.elementsToToggle.forEach(element => element.classList.add('hidden'));
        this.isCollapse = true;
    }

    /**
     * Collapses the elements and changes the triangle icon.
     */
    collapse() {
        this.element.classList.remove(Triangle.iconExpanded);
        this.element.classList.add(Triangle.iconFold);
        this.elementsToToggle.forEach(element => element.classList.remove('hidden'));
        this.isCollapse = false;
    }

    /**
     * Toggles the visibility of the elements and changes the triangle icon.
     */
    toggle() {
        this.isCollapse ? this.collapse() : this.expand();
    }
}

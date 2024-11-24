import {Preconditions} from "../utils/Preconditions.js";
import {BaseTriangle} from "./BaseTriangle.js";

/**
 * This class is used to create a triangle element that can be used to toggle the visibility of a DOM element.
 */
export class Triangle extends BaseTriangle {
    static iconFold = "bi-chevron-down";
    static iconExpanded = "bi-chevron-right";

    /**
     * Creates a new triangle element that can be used to toggle the visibility of a DOM element.
     * @param elementsToToggle {Node[]} The elements to toggle.
     * @param isCollapse {Boolean} Whether the elements are initially expanded or not.
     */
    constructor(elementsToToggle, isCollapse = false) {
        Preconditions.checkArrayOfTypes(elementsToToggle, Node);
        Preconditions.checkIfBoolean(isCollapse);

        super(Triangle.iconFold, Triangle.iconExpanded, isCollapse);

        this.elementsToToggle = elementsToToggle;
        this.toggle();
    }

    /**
     * Expands the elements and changes the triangle icon.
     */
    expand() {
        super.expand();
        if (!this.elementsToToggle) return;
        this.elementsToToggle.forEach(element => element.classList.add('hidden'));
    }

    /**
     * Collapses the elements and changes the triangle icon.
     */
    collapse() {
        super.collapse();
        if (!this.elementsToToggle) return;
        this.elementsToToggle.forEach(element => element.classList.remove('hidden'));
    }
}

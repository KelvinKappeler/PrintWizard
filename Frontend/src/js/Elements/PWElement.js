import {Preconditions} from "../utils/Preconditions.js";

/**
 * Base class for all elements. An element is an object that can be attached to a DOM element.
 */
export class PWElement {

    /**
     * Creates a new element.
     * @param element The DOM element to create.
     */
    constructor(element) {
        Preconditions.checkType(element, Node);
        this.element = element;
    }

    /**
     * Attaches the triangle to a parent element.
     * @param parent The parent element to attach the triangle to.
     */
    attachTo(parent) {
        Preconditions.checkType(parent, Node);
        parent.appendChild(this.element);
    }
}
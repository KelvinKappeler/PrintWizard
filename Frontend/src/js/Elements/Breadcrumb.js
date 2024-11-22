import {PWElement} from "./PWElement.js";
import {Preconditions} from "../utils/Preconditions.js";

/**
 * This class is used to manage a breadcrumb list
 */
export class Breadcrumb extends PWElement {

    /**
     * Creates a new breadcrumb list
     */
    constructor() {
        super(document.createElement('ul'));
        this.element.classList.add('breadcrumb');
    }

    /**
     * Adds a new entry to the breadcrumb list
     * @param entry The entry to add (string)
     */
    add(entry) {
        Preconditions.checkIfString(entry);
        let breadcrumbItem = document.createElement('li');
        breadcrumbItem.append(document.createTextNode(entry));
        this.element.append(breadcrumbItem);
    }

    /**
     * Clears the breadcrumb list
     */
    clear() {
        this.element.innerHTML = '';
    }

    /**
     * Removes the last entry from the breadcrumb list
     */
    removeLast() {
        this.element.removeChild(this.element.lastChild);
    }
}

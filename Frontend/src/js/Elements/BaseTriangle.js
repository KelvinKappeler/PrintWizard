import {Preconditions} from "../utils/Preconditions.js";
import {PWElement} from "./PWElement.js";

export class BaseTriangle extends PWElement {
    static iconFold = "bi-chevron-down";
    static iconExpanded = "bi-chevron-right";

    constructor(iconFold, iconExpanded, isCollapse = false) {
        Preconditions.checkIfBoolean(isCollapse);

        const element = document.createElement('i');
        element.classList.add('bi');
        element.addEventListener('click', () => this.toggle());
        super(element);

        this.isCollapse = !isCollapse;
        this.iconFold = iconFold;
        this.iconExpanded = iconExpanded;
    }

    expand() {
        this.element.classList.remove(this.iconFold);
        this.element.classList.add(this.iconExpanded);
        this.isCollapse = true;
    }

    collapse() {
        this.element.classList.remove(this.iconExpanded);
        this.element.classList.add(this.iconFold);
        this.isCollapse = false;
    }

    toggle() {
        this.isCollapse ? this.collapse() : this.expand();
    }
}

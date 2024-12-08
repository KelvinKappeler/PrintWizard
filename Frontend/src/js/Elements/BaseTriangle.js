import {Preconditions} from "../utils/Preconditions.js";
import {PWElement} from "./PWElement.js";

export class BaseTriangle extends PWElement {
    static iconFold = "bi-chevron-down";
    static iconExpanded = "bi-chevron-right";

    constructor(elementsToHide, isCollapse = false, iconFold = BaseTriangle.iconFold, iconExpanded = BaseTriangle.iconExpanded) {
        Preconditions.checkIfBoolean(isCollapse);

        const element = document.createElement('i');
        element.classList.add('bi');
        element.addEventListener('click', (event) => this.toggle(event));
        super(element);

        this.isCollapse = !isCollapse;
        this.iconFold = iconFold;
        this.iconExpanded = iconExpanded;
        this.elementsToHide = elementsToHide;

        this.toggle();
    }

    collapse() {
        this.element.classList.remove(this.iconFold);
        this.element.classList.add(this.iconExpanded);
        this.isCollapse = true;
        this.elementsToHide.forEach(element => element.classList.add('hidden'));
    }

    expand() {
        this.element.classList.remove(this.iconExpanded);
        this.element.classList.add(this.iconFold);
        this.isCollapse = false;
        this.elementsToHide.forEach(element => element.classList.remove('hidden'));
    }

    toggle(event = undefined) {
        this.isCollapse ? this.expand() : this.collapse();
    }
}

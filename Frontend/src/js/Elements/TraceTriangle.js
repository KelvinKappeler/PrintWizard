import {Preconditions} from "../utils/Preconditions.js";
import {BaseTriangle} from "./BaseTriangle.js";
import {TraceBlock} from "../Trace.js";

/**
 * This class is used to create a triangle element that can be used to toggle the visibility of a DOM element.
 */
export class TraceTriangle extends BaseTriangle {
    static iconFold = "bi-chevron-down";
    static iconExpanded = "bi-chevron-right";

    /**
     * Creates a new triangle element that can be used to toggle the visibility of a DOM element.
     * @param traceBlock {TraceBlock} The elements to toggle.
     * @param isCollapse {Boolean} Whether the elements are initially expanded or not.
     */
    constructor(traceBlock, isCollapse = false) {
        Preconditions.checkType(traceBlock, TraceBlock);
        Preconditions.checkIfBoolean(isCollapse);

        super([
            traceBlock.stackFragment.traceContent,
            traceBlock.stackFragment.triangles,
            traceBlock.stackFragment.linesNumber
        ], isCollapse);
        this.traceBlock = traceBlock;
    }

    toggle(event = undefined) {
        if (event && event.shiftKey) {
            this.toggleAll();
        } else {
            super.toggle(event);
        }

    }

    toggleAll() {
        this.traceBlock.subTriangles.forEach(triangle => {
            if (this.isCollapse) {
                triangle.expand();
            } else {
                triangle.collapse();
            }}
        );
        super.toggle();
    }
}

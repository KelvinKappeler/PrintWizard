import {BaseTriangle} from "./BaseTriangle.js";

export class FullTraceTriangle extends BaseTriangle {
    static iconFold = "bi-chevron-double-down";
    static iconExpanded = "bi-chevron-double-right";

    constructor(triangles) {
        super(FullTraceTriangle.iconFold, FullTraceTriangle.iconExpanded, false);

        this.triangles = triangles;
        super.expand();
    }

    expand() {
        super.expand();
        if (!this.triangles) return;
        this.triangles.forEach(triangle => triangle.expand());
    }

    collapse() {
        super.collapse();
        if (!this.triangles) return;
        this.triangles.forEach(triangle => triangle.collapse());
    }
}

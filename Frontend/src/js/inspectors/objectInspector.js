import {ObjectValue} from "../def.js";
import {createTriangle, toggleTriangle} from "../triangle.js";
import {Window} from "../window.js";

export class ObjectInspector {
    static objectInspectorId = document.getElementById('objectInspector');

    static update(objectValue) {
        if (ObjectInspector.checkIfEmpty()) {
            return;
        }

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('objectInspectorPanel');

        const titleDiv = document.createElement('div');
        const triangle = createTriangle();
        triangle.classList.add('triangleObjectInspector');
        triangle.addEventListener('click', () => {
           toggleTriangle(triangle, [fieldsDiv]);
        });
        titleDiv.appendChild(triangle);
        titleDiv.appendChild(document.createTextNode(objectValue.dataType + ": $" + objectValue.pointer));
        titleDiv.classList.add('objectTitle');
        const closeButton = document.createElement('i');
        closeButton.classList.add('bi');
        closeButton.classList.add('bi-x');
        closeButton.classList.add('closeButton');
        closeButton.addEventListener('click', () => {
            ObjectInspector.remove(mainDiv);
            ObjectInspector.checkIfEmpty();
        });
        titleDiv.appendChild(closeButton);
        mainDiv.appendChild(titleDiv);

        const fieldsDiv = document.createElement('div');
        fieldsDiv.classList.add('fieldsDiv');

        for (let i = 0; i < objectValue.fields.length; i++) {
            const field = objectValue.fields[i];
            const fieldDiv = document.createElement('div');

            const statesDiv = ObjectInspector.createFieldStateDiv(objectValue.states, objectValue, field);

            const fieldTriangle = createTriangle();
            fieldTriangle.addEventListener('click', () => {
                toggleTriangle(fieldTriangle, [statesDiv]);
            });
            toggleTriangle(fieldTriangle, [statesDiv]);
            fieldTriangle.classList.add('triangleFields');
            fieldDiv.appendChild(fieldTriangle)
            fieldDiv.classList.add('fieldDiv');
            fieldDiv.appendChild(document.createTextNode(field[1].dataType + " " + field[0] + ": "));
            if (field[1] instanceof ObjectValue) {
                fieldDiv.appendChild(field[1].documentFragment());
            } else {
                fieldDiv.appendChild(document.createTextNode(field[1].value));
            }

            fieldDiv.appendChild(statesDiv);
            fieldsDiv.appendChild(fieldDiv);
        }

        if (objectValue.fields.length === 0) {
            const emptyField = document.createElement('div');
            emptyField.innerHTML = 'No fields';
            fieldsDiv.appendChild(emptyField);
        }

        mainDiv.appendChild(fieldsDiv);

        ObjectInspector.objectInspectorId.prepend(mainDiv);
        mainDiv.scrollIntoView();

        ObjectInspector.objectInspectorId.prepend(Window.newWindow(mainDiv));
    }

    static clear() {
        ObjectInspector.objectInspectorId.innerHTML = '';
        this.update(undefined);
    }

    static remove(child) {
        ObjectInspector.objectInspectorId.removeChild(child);
    }

    static createEmptyState() {
        const div = document.createElement('div');
        div.id = 'objectInspectorEmpty';
        div.innerHTML = '<h2>No object selected</h2>';
        return div;
    }

    static checkIfEmpty() {
        if (ObjectInspector.objectInspectorId.childElementCount === 0) {
            ObjectInspector.objectInspectorId.append(ObjectInspector.createEmptyState());
            return true;
        }

        const emptyDiv = document.getElementById('objectInspectorEmpty');
        if (emptyDiv) {
            ObjectInspector.objectInspectorId.removeChild(emptyDiv);
        }
        return false;
    }

    static createFieldStateDiv(states, objectValue, currentField) {
        let fieldStates = states.map(node => node.fields)
        fieldStates = fieldStates.map(fields => fields.find(f => f.identifier.name === currentField[0]));
        console.log(fieldStates);
        const div = document.createElement('div');
        for (let f of fieldStates) {
            if (f instanceof ObjectValue) {
                div.appendChild(f.documentFragment());
            } else {
                div.appendChild(document.createTextNode(f.value.value));
            }
        }

        return div;
    }
}

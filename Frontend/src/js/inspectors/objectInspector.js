import {ObjectValue, PrimitiveValue} from "../def.js";
import {Triangle} from "../Elements/Triangle.js";
import {Window} from "../window.js";
import {Trace} from "../Trace.js";

export class ObjectInspector {
    static objectInspectorId = document.getElementById('objectInspector');

    static add(objectValue, isWindow = false) {
        if (ObjectInspector.checkIfEmpty()) {
            return;
        }

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('objectInspectorPanel');

        const fieldsDiv = document.createElement('div');
        fieldsDiv.classList.add('fieldsDiv');

        const titleDiv = document.createElement('div');
        const triangle = new Triangle([fieldsDiv]);
        triangle.element.classList.add('triangleObjectInspector');
        triangle.attachTo(titleDiv);
        titleDiv.appendChild(document.createTextNode(
            objectValue.dataType + ": $" + objectValue.pointer + " (v" + objectValue.version + ")"
        ));
        titleDiv.classList.add('objectTitle');
        const openWindow = document.createElement('i');
        openWindow.classList.add('bi');
        openWindow.classList.add('bi-window-plus');
        openWindow.classList.add('closeButton');
        openWindow.addEventListener('click', () => {
            ObjectInspector.add(objectValue, true);
            ObjectInspector.remove(mainDiv);
        });

        const closeButton = document.createElement('i');
        closeButton.classList.add('bi');
        closeButton.classList.add('bi-x');
        closeButton.classList.add('closeButton');
        closeButton.addEventListener('click', () => {
            ObjectInspector.remove(mainDiv);
            ObjectInspector.checkIfEmpty();
        });
        if (!isWindow) {
            titleDiv.appendChild(closeButton);
            titleDiv.appendChild(openWindow);
        }
        mainDiv.appendChild(titleDiv);

        for (let i = 0; i < objectValue.fields.length; i++) {
            const field = objectValue.fields[i];
            const fieldDiv = document.createElement('div');

            const statesDiv = ObjectInspector.createFieldStateDiv(objectValue.states, objectValue, field);

            const fieldTriangle = new Triangle([statesDiv]);
            fieldTriangle.element.classList.add('triangleFields');
            fieldTriangle.attachTo(fieldDiv);
            fieldDiv.classList.add('fieldDiv');
            fieldDiv.appendChild(document.createTextNode(field[1].dataType + " " + field[0] + ": "));
            if (field[1] instanceof PrimitiveValue) {
                fieldDiv.appendChild(document.createTextNode(field[1].value));
            } else {
                fieldDiv.appendChild(field[1].documentFragment());
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

        if (isWindow) {
            ObjectInspector.objectInspectorId.prepend(Window.newWindow("Object Inspector", mainDiv,
                () => {
                    ObjectInspector.add(objectValue);
                }));
        }
    }

    static clear() {
        ObjectInspector.objectInspectorId.innerHTML = '';
        this.add(undefined);
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
        let objectStates = states.stateDictionary.get(objectValue.pointer);
        let fieldStates = objectStates.map(objectVal => [objectVal, objectVal.fields.find(f => f[0] === currentField[0])[1]]);
        const currentVersion = states.getLastVersion(objectValue.pointer, objectValue.version).self.version;

        const mainDiv = document.createElement('div');
        let lastValue = undefined;
        for (let f of fieldStates) {
            const div = document.createElement('div');
            const obj = f[0];
            const value = f[1];

            if (currentVersion === obj.version) {
                div.classList.add('currentState');
                div.append(document.createTextNode('▶ '));
            }
            if (value instanceof PrimitiveValue) {
                if (value.value === lastValue && currentVersion !== obj.version) continue;
                div.append(document.createTextNode(value.value));
                lastValue = value.value;
            } else {
                if (lastValue !== undefined && value.fields === lastValue.fields && currentVersion !== obj.version) continue;
                div.append(value.documentFragment());
                lastValue = value;
            }

            div.append(document.createTextNode(" | v" + obj.version + " | "));
            div.append(obj.documentFragment());

            const viewInTrace = document.createElement('button');
            viewInTrace.classList.add('viewInTrace');
            viewInTrace.innerHTML = '<i class="bi bi-search"></i>'; // Add the icon (using Bootstrap icons)

            viewInTrace.addEventListener('click', () => {
                console.log('Inspect button clicked for object:', obj);
            });

            div.append(viewInTrace);
            div.append(document.createElement('br'));
            div.classList.add('fieldState');



            mainDiv.append(div);
        }

        return mainDiv;
    }
}

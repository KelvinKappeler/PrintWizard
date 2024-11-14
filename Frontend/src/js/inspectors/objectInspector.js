import {PrimitiveValue} from "../def.js";

export class ObjectInspector {
    static objectInspectorId = document.getElementById('objectInspector');

    static update(objectValue) {
        //ObjectInspector.objectInspectorId.innerHTML = '';

        if (objectValue === undefined) {
            const h2 = document.createElement('h2');
            h2.appendChild(document.createTextNode('No object selected'));
            ObjectInspector.objectInspectorId.appendChild(h2);

            return;
        }

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('objectInspectorPanel');

        const closeButton = document.createElement('button');
        closeButton.classList.add('bi');
        closeButton.classList.add('bi-x');
        closeButton.addEventListener('click', () => {
            ObjectInspector.removeAtIndex(ObjectInspector.getLength());
        });
        mainDiv.appendChild(closeButton);

        const h2 = document.createElement('h2');
        h2.appendChild(document.createTextNode('General'));
        mainDiv.appendChild(h2)

        const generalRows = [
            { label: "Id:", value: objectValue.pointer },
            { label: "Type:", value: objectValue.dataType }
        ];

        mainDiv.appendChild(this.createHeaderTable(generalRows, 'objectInspectorDescription'));

        const fieldsTitle = document.createElement("h2");
        fieldsTitle.appendChild(document.createTextNode('Fields'));
        mainDiv.appendChild(fieldsTitle);

        if (objectValue.fields.length === 0) {
            mainDiv.appendChild(document.createTextNode("No fields"));
            return;
        }

        mainDiv.appendChild(ObjectInspector.createFieldsTable(objectValue.fields, undefined));
        ObjectInspector.objectInspectorId.prepend(mainDiv);
    }

    static createHeaderTable(data, id) {
        const table = document.createElement("table");
        table.id = id;

        data.forEach(row => {
            const tr = document.createElement("tr");

            const labelCell = document.createElement("td");
            labelCell.innerHTML = `<strong>${row.label}</strong>`;

            const valueCell = document.createElement("td");
            valueCell.textContent = row.value;

            tr.appendChild(labelCell);
            tr.appendChild(valueCell);
            table.appendChild(tr);
        });

        return table;
    }

    static createFieldsTable(fields, id) {
        const fieldsTable = document.createElement("table");
        fieldsTable.id = "objectFields";

        const headerRow = document.createElement("tr");
        ["Name", "Type", "Value"].forEach(headerText => {
            const th = document.createElement("td");
            th.innerHTML = `<strong>${headerText}</strong>`;
            headerRow.appendChild(th);
        });
        fieldsTable.appendChild(headerRow);

        fields.forEach(field => {
            const tr = document.createElement("tr");

            const nameCell = document.createElement("td");
            const typeCell = document.createElement("td");
            const valueCell = document.createElement("td");

            nameCell.textContent = field[0];
            if (field[1] instanceof PrimitiveValue) {
                typeCell.textContent = field[1].dataType;
                valueCell.textContent = field[1].value;
            } else {
                typeCell.textContent = field[1].dataType;
                valueCell.appendChild(field[1].documentFragment())
            }

            tr.appendChild(nameCell);
            tr.appendChild(typeCell);
            tr.appendChild(valueCell);
            fieldsTable.appendChild(tr);
        });

        return fieldsTable;
    }

    static clear() {
        ObjectInspector.objectInspectorId.innerHTML = '';
        this.update(undefined);
    }

    static removeAtIndex(index) {
        ObjectInspector.objectInspectorId.removeChild(ObjectInspector.objectInspectorId.childNodes[index]);
    }

    static getLength() {
        return ObjectInspector.objectInspectorId.childNodes.length;
    }
}

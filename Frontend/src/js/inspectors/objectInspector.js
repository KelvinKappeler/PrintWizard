export class ObjectInspector {
    static objectInspectorId = document.getElementById('objectInspector');

    static update(objectValue) {
        ObjectInspector.objectInspectorId.innerHTML = '';

        if (objectValue === undefined) {
            const h2 = document.createElement('h2');
            h2.appendChild(document.createTextNode('No object selected'));
            ObjectInspector.objectInspectorId.appendChild(h2);

            return;
        }

        const h2 = document.createElement('h2');
        h2.appendChild(document.createTextNode('General'));
        ObjectInspector.objectInspectorId.appendChild(h2)

        const generalRows = [
            { label: "Id:", value: objectValue.pointer },
            { label: "Type:", value: objectValue.dataType }
        ];

        ObjectInspector.objectInspectorId.appendChild(this.createTable(generalRows, 'objectInspectorDescription'));

    }

    static createTable(data, id) {
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

    /*
    function update(objectData) {
        // Select the object inspector container
        const objectInspector = document.getElementById("objectInspector");

        // Clear any existing content inside the object inspector
        objectInspector.innerHTML = '';

        // Create the General section
        const generalTitle = document.createElement("h2");
        generalTitle.textContent = "General";
        objectInspector.appendChild(generalTitle);

        const generalTable = document.createElement("table");
        generalTable.id = "objectInspectorDescription";

        // Add rows for general info (dummy data for now)
        const generalRows = [
            { label: "Name:", value: "dummyName" },
            { label: "Type:", value: "dummyType" }
        ];

        generalRows.forEach(row => {
            const tr = document.createElement("tr");

            const labelCell = document.createElement("td");
            labelCell.innerHTML = `<strong>${row.label}</strong>`;

            const valueCell = document.createElement("td");
            valueCell.textContent = row.value;

            tr.appendChild(labelCell);
            tr.appendChild(valueCell);
            generalTable.appendChild(tr);
        });

        objectInspector.appendChild(generalTable);

        // Create the Fields section
        const fieldsTitle = document.createElement("h2");
        fieldsTitle.textContent = "Fields";
        objectInspector.appendChild(fieldsTitle);

        const fieldsTable = document.createElement("table");
        fieldsTable.id = "objectFields";

        // Create header row for the fields table
        const headerRow = document.createElement("tr");
        ["Name", "Type", "Value"].forEach(headerText => {
            const th = document.createElement("td");
            th.innerHTML = `<strong>${headerText}</strong>`;
            headerRow.appendChild(th);
        });
        fieldsTable.appendChild(headerRow);

        // Add dummy rows for fields (dummy data for now)
        const fieldsData = [
            { name: "dummyField1", type: "dummyType1", value: "dummyValue1" },
            { name: "dummyField2", type: "dummyType2", value: "dummyValue2" },
            { name: "dummyField3", type: "dummyType3", value: "dummyValue3" }
        ];

        fieldsData.forEach(field => {
            const tr = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = field.name;

            const typeCell = document.createElement("td");
            typeCell.textContent = field.type;

            const valueCell = document.createElement("td");
            valueCell.textContent = field.value;

            tr.appendChild(nameCell);
            tr.appendChild(typeCell);
            tr.appendChild(valueCell);
            fieldsTable.appendChild(tr);
        });

        objectInspector.appendChild(fieldsTable);
    }
*/
}

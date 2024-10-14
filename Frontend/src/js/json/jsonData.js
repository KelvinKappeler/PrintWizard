import {SourceFormat} from "./sourceFormat.js";
import {ObjectData} from "./objectData.js";

export class JsonData {
    static sourceFormatFile = "source_format.json";
    static objectDataFile = "objectData.json";

    constructor(location) {
        this.sourceFormat = fetch(location + JsonData.sourceFormatFile)
            .then(response => response.json())
            .then(data => { return new SourceFormat(data) });

        this.objectData = fetch(location + JsonData.objectDataFile)
            .then(response => response.json())
            .then(data => { return new ObjectData(data) });
    }
}

const data = new JsonData("../");
data.sourceFormat.then(data => console.log(data));
data.objectData.then(data => console.log(data));

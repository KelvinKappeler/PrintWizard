import {SourceFormat} from "./sourceFormat.js";
import {ObjectData} from "./objectData.js";
import {Trace} from "./eventTrace.js";

export class JsonData {
    static sourceFormatFile = "source_format.json";
    static objectDataFile = "objectData.json";
    static traceFile = "eventTrace.json";

    static jsonData = new JsonData("../");

    constructor(location) {
        this.sourceFormat = fetch(location + JsonData.sourceFormatFile)
            .then(response => response.json())
            .then(data => { return new SourceFormat(data) });

        this.objectData = fetch(location + JsonData.objectDataFile)
            .then(response => response.json())
            .then(data => { return new ObjectData(data) });

        this.eventTrace = fetch(location + JsonData.traceFile)
            .then(response => response.json())
            .then(data => { return new Trace(data) });
    }

    getAllData() {
        return Promise.all([this.sourceFormat, this.objectData, this.eventTrace]);
    }
}

//JsonData.jsonData.sourceFormat.then(data => console.log(data));
//JsonData.jsonData.objectData.then(data => console.log(data));
//JsonData.jsonData.eventTrace.then(data => console.log(data));

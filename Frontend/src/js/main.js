import {JsonData} from "./json/jsonData.js";
import {Trace} from "./trace.js";
import {translateToTreeFormat} from "./jsonTranslate.js";
import {ObjectInspector} from "./inspectors/objectInspector.js";

JsonData.jsonData.getAllData().then(data => {
    const finalTreeTrace = translateToTreeFormat(data[2], data[0], data[1]);
    console.log(finalTreeTrace);
    const trace = new Trace(finalTreeTrace);
    trace.show();

    ObjectInspector.update(undefined);
});

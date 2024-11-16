import {JsonData} from "./json/jsonData.js";
import {Trace} from "./trace.js";
import {translateToTreeFormat} from "./jsonTranslate.js";
import {ObjectInspector} from "./inspectors/objectInspector.js";
import {Breadcrumb} from "./breadcrumb.js";

export function loadData(location) {
    console.clear();
    JsonData.withLocation(location).getAllData().then(data => {
        const finalTreeTrace = translateToTreeFormat(data[2], data[0], data[1]);
        console.log(finalTreeTrace);
        const trace = new Trace(finalTreeTrace);
        trace.show();
        ObjectInspector.clear();
        Breadcrumb.clear();
        Breadcrumb.add(data[0].sourceFile.fileName);
        Breadcrumb.add(finalTreeTrace.name + "()");
    });
}

loadData('../Data/BasicOperation/');

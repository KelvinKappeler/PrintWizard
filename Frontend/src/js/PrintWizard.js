import {Breadcrumb} from "./Elements/Breadcrumb.js";
import {JsonData} from "./json/JsonData.js";
import {translateToTreeFormat} from "./jsonTranslate.js";
import {Trace} from "./trace.js";
import {ObjectInspector} from "./inspectors/objectInspector.js";
import {Preconditions} from "./utils/Preconditions.js";

/**
 * This class is responsible to manage PrintWizard
 */
export class PrintWizard {
    constructor() {
        this.breadcrumb = new Breadcrumb();
        this.breadcrumb.attachTo(document.querySelector('.breadcrumb'));
        this.jsonData = undefined;
    }

    /**
     * This method is used to load data from the given location
     * @param location The location to load data from
     */
    loadData(location) {
        Preconditions.checkIfString(location);

        console.clear();
        this.jsonData = new JsonData(location);
        this.jsonData.getAllData().then(data => {
            const finalTreeTrace = translateToTreeFormat(data[2], data[0], data[1]);
            console.log(finalTreeTrace);
            const trace = new Trace(finalTreeTrace);
            trace.show();

            this.breadcrumb.clear();
            this.breadcrumb.add(data[0].sourceFile.fileName);
            this.breadcrumb.add(finalTreeTrace.name + "()");

            ObjectInspector.clear();
        });
    }
}

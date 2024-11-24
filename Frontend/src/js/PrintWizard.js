import {Breadcrumb} from "./Elements/Breadcrumb.js";
import {JsonData} from "./json/JsonData.js";
import {translateToTreeFormat} from "./JsonTranslate.js";
import {Trace} from "./Trace.js";
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
        this.objectInspector = new ObjectInspector();
        this.objectInspector.attachTo(document.querySelector('#inspector'));
        this.trace = undefined;
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

            this.trace = new Trace(finalTreeTrace);
            this.trace.show();

            this.breadcrumb.clear();
            this.breadcrumb.add(data[0].sourceFile.fileName);
            this.breadcrumb.add(finalTreeTrace.name + "()");

            this.openInspectorTab('objectInspector');
            this.objectInspector.clear();
        });
    }

    openInspectorTab(inspectorName) {
        let tabs = document.getElementsByClassName("inspectorContent");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].style.display = "none";
        }
        document.getElementById(inspectorName).style.display = "block";

        // Remove active class from all buttons
        let buttons = document.getElementsByClassName("tab_button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }

        // Add active class to the clicked button
        let activeButton = document.querySelector(`button[onclick="pw.openInspectorTab('${inspectorName}')"]`);
        activeButton.classList.add("active");
    }
}

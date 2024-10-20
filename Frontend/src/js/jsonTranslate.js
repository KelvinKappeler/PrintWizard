import {FunctionTrace, StatementTrace, SubStatementTrace, StepTrace} from "./def.js";
import {JsonData} from "./json/jsonData.js";
import {Event, Step} from "./json/eventTrace.js";

function translateToTreeFormat(actualTrace, sourceFormat, objectData) {
    function rec(actualTrace, sourceFormat, objectData) {

        if (actualTrace.trace.length === 0) {
            return [actualTrace, null];
        }

        const elem = actualTrace.trace[0];
        let newTrace = actualTrace.sliceFirst();
        let newTraceElem = null;
        let nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;

        function processWhileLoop(newTraceElem, eventId) {
            while (nextEventId !== eventId) {
                let [returnedTrace, innerStatement] = rec(newTrace, sourceFormat, objectData);

                if (innerStatement != null) {
                    newTraceElem.content.push(innerStatement);
                }

                newTrace = returnedTrace;
                nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;
            }

            newTrace = newTrace.sliceFirst();
        }

        if (elem instanceof Event) {
            let eventId = elem.eventId;
            if (elem.eventType === 'controlFlow' && elem.kind.type === 'FunctionContext') {
                newTraceElem = new FunctionTrace();
                newTraceElem.name = elem.kind.functionName;
                processWhileLoop(newTraceElem, eventId);
            } else if (elem.eventType === 'statement') {
                newTraceElem = new StatementTrace(elem.eventId);
                processWhileLoop(newTraceElem, eventId);
            } else if (elem.eventType === 'subStatement') {
                newTraceElem = new SubStatementTrace(elem.eventId);
                processWhileLoop(newTraceElem, eventId);
            }
        } else if (elem instanceof Step) {
            newTraceElem = new StepTrace();
            if (elem.nodeKey) {
                let syntaxNodeInSource = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.identifier === elem.nodeKey);
                newTraceElem.content = syntaxNodeInSource.getNodeText();
                newTraceElem.lineNumber = (syntaxNodeInSource.startLine === undefined) ? "-" : syntaxNodeInSource.startLine;
            }
        }

        return [newTrace, newTraceElem];
    }

    return rec(actualTrace, sourceFormat, objectData)[1];
}

JsonData.jsonData.getAllData().then(data => {
    const finalTreeTrace = translateToTreeFormat(data[2], data[0], data[1]);
    console.log(finalTreeTrace);
    finalTreeTrace.show(null);
});

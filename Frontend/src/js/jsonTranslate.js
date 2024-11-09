import {FunctionTrace, StatementTrace, ExpressionTrace, AssignmentExpressionTrace} from "./def.js";
import {Event, Step} from "./json/eventTrace.js";
import {Value} from "./def.js";

export function translateToTreeFormat(actualTrace, sourceFormat, objectData) {
    function rec(actualTrace, sourceFormat, objectData, dataStack) {
        console.log("Current state of dataStack:", JSON.stringify(dataStack.map(elem => elem[0].name + "   " + elem[1].toString() ), null, 2));
        console.log([...dataStack])

        if (actualTrace.trace.length === 0) {
            return dataStack[0][0];
        }

        const elem = actualTrace.trace[0];
        let newTrace = actualTrace.sliceFirst();

        if (elem instanceof Event) {
            let eventId = elem.eventId;
            if (elem.eventType === 'controlFlow' && elem.kind.type === 'FunctionContext') {
                if (elem.pos === 'start') {
                    if (dataStack.length === 0) {
                        //Main function
                        let mainFunction = new FunctionTrace();
                        mainFunction.name = elem.kind.functionName;
                        dataStack.push([mainFunction, true]);
                    } else {
                        let stackElement = dataStack[dataStack.length - 1];
                        stackElement[0].name = elem.kind.functionName;
                        stackElement[1] = true;
                    }
                } else {
                    let ft = dataStack[dataStack.length - 1][0];
                    if (ft.isVoid) {
                        dataStack.pop();
                        pushElement(dataStack, ft);
                    }
                }
            } else if (elem.eventType === 'statement') {
                if (elem.pos === 'start') {
                    let st = new StatementTrace();
                    dataStack.push([st, true]);
                } else {
                    let st = dataStack.pop()[0];
                    if (st.content.length !== 0) {
                        let syntaxNodeInSource = st.content.find(syntaxNode => syntaxNode.lineNumber !== undefined);
                        st.lineNumber = syntaxNodeInSource.lineNumber;
                        pushElement(dataStack, st);
                        st.line = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.startLine === st.lineNumber)?.getEntireText();
                    }
                }
            } else if (elem.eventType === 'subStatement') {

            }
        } else if (elem instanceof Step) {
            if (elem.kind === 'logCall' || (elem.kind === 'logVoidCall' && elem.nodeKey !== "absent")) {
                let ft = new FunctionTrace();
                ft.args = elem.argsValues.map(arg => Value.newValue(arg));
                let syntaxNodeInSource = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.identifier === elem.nodeKey);
                ft.lineNumber = (syntaxNodeInSource.startLine === undefined) ? "-" : syntaxNodeInSource.startLine;

                if (elem.kind === 'logVoidCall') {
                    ft.isVoid = true;
                }

                dataStack.push([ft, false]);
            } else if (elem.kind === 'logReturn') {
                let ft = dataStack.pop()[0];
                ft.returnVal = Value.newValue(elem.result);
                pushElement(dataStack, ft);
            } else if (elem.kind === 'expressionWithoutReturn' || elem.kind === 'expression') {
                let expTrace = new ExpressionTrace();
                if (elem.assigns.length !== 0) {
                    expTrace = new AssignmentExpressionTrace();
                }

                let syntaxNodeInSource = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.identifier === elem.nodeKey);
                expTrace.content = syntaxNodeInSource.getExpressionText();
                expTrace.lineNumber = (syntaxNodeInSource.startLine === undefined) ? "-" : syntaxNodeInSource.startLine;
                expTrace.assigns = elem.assigns.map(assign => [Value.newValue(assign.value), assign.identifier.name]);
                expTrace.result = elem.result ? Value.newValue(elem.result) : undefined;
                pushElement(dataStack, expTrace);
            }
        }

        return rec(newTrace, sourceFormat, objectData, dataStack);
    }

    function pushElement(dataStack, elem) {
        const result = dataStack.slice().reverse().findIndex(stackElem => stackElem[1]);
        dataStack[dataStack.length - 1 - result][0].content.push(elem);
    }

    return rec(actualTrace, sourceFormat, objectData, []);
}


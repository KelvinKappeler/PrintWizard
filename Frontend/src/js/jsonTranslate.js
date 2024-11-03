import {FunctionTrace, StatementTrace, ExpressionTrace, AssignmentExpressionTrace} from "./def.js";
import {Event, Step} from "./json/eventTrace.js";
import {Value} from "./def.js";

export function translateToTreeFormat(actualTrace, sourceFormat, objectData) {
    function rec(actualTrace, sourceFormat, objectData, dataStack) {
        if (actualTrace.trace.length === 0) {
            return dataStack[0];
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
                        dataStack.push(mainFunction);
                    } else {
                        let ft = dataStack[dataStack.length - 1];
                        ft.name = elem.kind.functionName;
                    }
                } else {
                    //Nothing to do
                }
            } else if (elem.eventType === 'statement') {
                if (elem.pos === 'start') {
                    let st = new StatementTrace();
                    dataStack.push(st);
                } else {
                    let st = dataStack.pop();
                    if (st.content.length !== 0) {
                        let syntaxNodeInSource = st.content.find(syntaxNode => syntaxNode.lineNumber !== undefined);
                        st.lineNumber = syntaxNodeInSource.lineNumber;
                        dataStack[dataStack.length - 1].content.push(st);
                        st.line = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.startLine === st.lineNumber).getEntireText();
                    }
                }
            } else if (elem.eventType === 'subStatement') {

            }
        } else if (elem instanceof Step) {
            if (elem.kind === 'logCall') {
                let ft = new FunctionTrace();
                ft.args = elem.argsValues.map(arg => Value.newValue(arg));
                let syntaxNodeInSource = sourceFormat.syntaxNodes.find(syntaxNode => syntaxNode.identifier === elem.nodeKey);
                ft.lineNumber = (syntaxNodeInSource.startLine === undefined) ? "-" : syntaxNodeInSource.startLine;
                dataStack.push(ft);
            } else if (elem.kind === 'logReturn') {
                let ft = dataStack.pop();
                ft.returnVal = Value.newValue(elem.result);
                dataStack[dataStack.length - 1].content.push(ft);
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
                dataStack[dataStack.length - 1].content.push(expTrace);
            }
        }

        return rec(newTrace, sourceFormat, objectData, dataStack);
    }

    return rec(actualTrace, sourceFormat, objectData, []);
}

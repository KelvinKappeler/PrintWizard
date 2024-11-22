import {FunctionTrace, StatementTrace, ExpressionTrace, AssignmentExpressionTrace} from "./def.js";
import {Event, Step} from "./json/eventTrace.js";
import {Value} from "./def.js";

export function translateToTreeFormat(trace, sourceFormat, objectData) {
    let dataStack = [];
    trace.trace = trace.trace.reverse();
    let currentTrace = trace;

    const syntaxNodeCache = new Map();
    sourceFormat.syntaxNodes.forEach(node => {
        syntaxNodeCache.set(node.identifier, node);
    });

    const lineNumberToSyntaxNode = new Map();
    sourceFormat.syntaxNodes.forEach(node => {
        if (node.startLine !== undefined) {
            lineNumberToSyntaxNode.set(node.startLine, node.getEntireText());
        }
    });

    while (currentTrace.trace.length > 0) {
        const elem = currentTrace.trace.pop();
        let newTrace = currentTrace;

        if (elem instanceof Event) {
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
                    let nextElem = newTrace.trace[newTrace.trace.length - 1];
                    if (nextElem instanceof Event && nextElem.eventType === 'controlFlow' && nextElem.kind.type === 'DefaultContext' && nextElem.pos === 'start') {
                        newTrace.trace.pop();
                    } else {
                        let st = dataStack.pop()[0];
                        if (st.content.length !== 0) {
                            let syntaxNodeInSource = st.content.find(traceElem => traceElem.lineNumber !== undefined);
                            st.lineNumber = syntaxNodeInSource.lineNumber;
                            pushElement(dataStack, st);
                            st.line = lineNumberToSyntaxNode.get(st.lineNumber);
                        }
                    }
                }
            } else if (elem.eventType === 'subStatement') {

            } else if (elem.eventType === 'controlFlow' && elem.kind.type === 'DefaultContext' && elem.pos === 'end') {
                let st = dataStack.pop()[0];
                if (st.content.length !== 0) {
                    let syntaxNodeInSource = st.content.find(traceElem => traceElem.lineNumber !== undefined);
                    st.lineNumber = syntaxNodeInSource.lineNumber;
                    pushElement(dataStack, st);
                    st.line = lineNumberToSyntaxNode.get(st.lineNumber);
                }
            }
        } else if (elem instanceof Step) {
            if (elem.kind === 'logCall' || (elem.kind === 'logVoidCall' && elem.nodeKey !== 'absent')) {
                let nextElem = newTrace.trace[newTrace.trace.length - 1]
                let ft = new FunctionTrace();
                ft.args = elem.argsValues.map(arg => Value.newValue(arg, objectData));
                let syntaxNodeInSource = syntaxNodeCache.get(elem.nodeKey);
                ft.lineNumber = (syntaxNodeInSource.startLine === undefined) ? '-' : syntaxNodeInSource.startLine;

                if (elem.kind === 'logVoidCall') {
                    ft.isVoid = true;
                }

                const isExternalWithoutReturn = (nextElem instanceof Event && (nextElem.eventType === 'statement' || nextElem.eventType === 'subStatement') && nextElem.pos === 'end');
                const isExternalWithReturn = (nextElem instanceof Step && nextElem.kind === 'logReturn');
                ft.isExternal = isExternalWithoutReturn || isExternalWithReturn;

                if (!ft.isExternal) {
                    dataStack.push([ft, false]);
                } else {
                    if (isExternalWithReturn) {
                        ft.returnVal = Value.newValue(nextElem.result, objectData);
                        newTrace.trace.pop();
                    }

                    ft.name = syntaxNodeInSource.getFirstExpressionWithoutParenthesis();
                    pushElement(dataStack, ft);
                }

            } else if (elem.kind === 'logReturn') {
                let ft = dataStack.pop()[0];
                ft.returnVal = Value.newValue(elem.result, objectData);
                pushElement(dataStack, ft);
            } else if (elem.kind === 'expressionWithoutReturn' || elem.kind === 'expression') {
                let expTrace = new ExpressionTrace();
                if (elem.assigns.length !== 0) {
                    expTrace = new AssignmentExpressionTrace();
                }

                let syntaxNodeInSource = syntaxNodeCache.get(elem.nodeKey);
                expTrace.content = syntaxNodeInSource.getExpressionText();
                expTrace.lineNumber = (syntaxNodeInSource.startLine === undefined) ? "-" : syntaxNodeInSource.startLine;
                expTrace.assigns = elem.assigns.map(assign => [Value.newValue(assign.value, objectData), assign.identifier.name]);
                expTrace.result = elem.result ? Value.newValue(elem.result, objectData) : undefined;
                pushElement(dataStack, expTrace);
            }
        }

        currentTrace = newTrace;
    }

    return dataStack[0][0];

    function pushElement(dataStack, elem) {
        const result = dataStack.slice().reverse().findIndex(stackElem => stackElem[1]);
        dataStack[dataStack.length - 1 - result][0].content.push(elem);
    }
}

import {FunctionTrace, StatementTrace, SubStatementTrace, StepTrace} from "./def.js";


const jsonString = `{
  "trace": [
    {
      "eventId": 0,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "main"
      }
    },
    {
      "eventId": 1,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "eventId": 2,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "stepId": 3,
      "nodeKey": "BasicOperation.java-7:15-7:22",
      "argsValues": [],
      "type": "ExecutionStep",
      "kind": "logCall"
    },
    {
      "eventId": 4,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "<init>"
      }
    },
    {
      "eventId": 5,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "eventId": 6,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "eventId": 6,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "stepId": 0,
      "nodeKey": "absent",
      "argsValues": [],
      "type": "ExecutionStep",
      "kind": "logVoidCall"
    },
    {
      "eventId": 5,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 4,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "<init>"
      }
    },
    {
      "stepId": 3,
      "result": {
        "pointer": 885284298,
        "className": {
          "className": "A",
          "packageName": ""
        },
        "version": 1,
        "dataType": "instanceRef"
      },
      "nodeKey": "BasicOperation.java-7:15-7:22",
      "type": "ExecutionStep",
      "kind": "logReturn"
    },
    {
      "eventId": 2,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "nodeKey": "BasicOperation.java-7:9-7:23",
      "assigns": [
        {
          "value": {
            "pointer": 885284298,
            "className": {
              "className": "A",
              "packageName": ""
            },
            "version": 3,
            "dataType": "instanceRef"
          },
          "identifier": {
            "name": "a",
            "parent": "-",
            "dataType": "localIdentifier"
          },
          "dataType": "write"
        }
      ],
      "type": "ExecutionStep",
      "kind": "expressionWithoutReturn"
    },
    {
      "eventId": 1,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 7,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "eventId": 8,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "stepId": 9,
      "nodeKey": "BasicOperation.java-8:32-8:43",
      "argsValues": [],
      "type": "ExecutionStep",
      "kind": "logCall"
    },
    {
      "eventId": 10,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "number2"
      }
    },
    {
      "eventId": 10,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "number2"
      }
    },
    {
      "stepId": 9,
      "result": {
        "value": 1,
        "dataType": "int"
      },
      "nodeKey": "BasicOperation.java-8:32-8:43",
      "type": "ExecutionStep",
      "kind": "logReturn"
    },
    {
      "eventId": 8,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "stepId": 11,
      "nodeKey": "BasicOperation.java-8:9-8:44",
      "argsValues": [
        {
          "value": 1,
          "dataType": "int"
        }
      ],
      "type": "ExecutionStep",
      "kind": "logCall"
    },
    {
      "eventId": 12,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "stepId": 13,
      "nodeKey": "BasicOperation.java-8:15-8:26",
      "argsValues": [],
      "type": "ExecutionStep",
      "kind": "logCall"
    },
    {
      "eventId": 14,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "number1"
      }
    },
    {
      "eventId": 14,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "number1"
      }
    },
    {
      "stepId": 13,
      "result": {
        "value": 1,
        "dataType": "int"
      },
      "nodeKey": "BasicOperation.java-8:15-8:26",
      "type": "ExecutionStep",
      "kind": "logReturn"
    },
    {
      "stepId": 15,
      "nodeKey": "BasicOperation.java-8:9-8:27",
      "argsValues": [
        {
          "value": 1,
          "dataType": "int"
        }
      ],
      "type": "ExecutionStep",
      "kind": "logCall"
    },
    {
      "eventId": 16,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "foo"
      }
    },
    {
      "eventId": 17,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "result": {
        "pointer": 885284298,
        "className": {
          "className": "A",
          "packageName": ""
        },
        "version": 5,
        "dataType": "instanceRef"
      },
      "nodeKey": "BasicOperation.java-21:20-21:24",
      "assigns": [],
      "type": "ExecutionStep",
      "kind": "expression"
    },
    {
      "eventId": 17,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 16,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "foo"
      }
    },
    {
      "stepId": 15,
      "result": {
        "pointer": 885284298,
        "className": {
          "className": "A",
          "packageName": ""
        },
        "version": 7,
        "dataType": "instanceRef"
      },
      "nodeKey": "BasicOperation.java-8:9-8:27",
      "type": "ExecutionStep",
      "kind": "logReturn"
    },
    {
      "eventId": 12,
      "eventType": "subStatement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 18,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "start",
      "kind": {
        "type": "FunctionContext",
        "functionName": "bar"
      }
    },
    {
      "eventId": 19,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "start"
    },
    {
      "result": {
        "pointer": 885284298,
        "className": {
          "className": "A",
          "packageName": ""
        },
        "version": 9,
        "dataType": "instanceRef"
      },
      "nodeKey": "BasicOperation.java-25:20-25:24",
      "assigns": [],
      "type": "ExecutionStep",
      "kind": "expression"
    },
    {
      "eventId": 19,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 18,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "bar"
      }
    },
    {
      "stepId": 11,
      "result": {
        "pointer": 885284298,
        "className": {
          "className": "A",
          "packageName": ""
        },
        "version": 11,
        "dataType": "instanceRef"
      },
      "nodeKey": "BasicOperation.java-8:9-8:44",
      "type": "ExecutionStep",
      "kind": "logReturn"
    },
    {
      "eventId": 7,
      "eventType": "statement",
      "type": "GroupEvent",
      "pos": "end"
    },
    {
      "eventId": 0,
      "eventType": "controlFlow",
      "type": "GroupEvent",
      "pos": "end",
      "kind": {
        "type": "FunctionContext",
        "functionName": "main"
      }
    }
  ]
}`;

// =================
// =================
// =================
// =================

class Trace {
    constructor(trace) {
        this.trace = trace;
    }
}

class BaseEntry {
    constructor(entry) {
        // You can initialize common properties here if needed
    }
}

class Event extends BaseEntry {
    constructor(event) {
        super(event);
        this.eventId = event.eventId;
        this.eventType = event.eventType;
        this.type = event.type;
        this.pos = event.pos;
        this.kind = event.kind ? new Kind(event.kind) : undefined;
    }
}

class Kind {
    constructor(kind) {
        this.type = kind.type;
        this.functionName = kind.functionName;
    }
}

class Step extends BaseEntry {
    constructor(step) {
        super(step);
        this.stepId = step.stepId;
        this.nodeKey = step.nodeKey;
        this.argsValues = step.argsValues ? step.argsValues.map(arg => new ArgValue(arg)) : [];
        this.type = step.type;
        this.kind = step.kind;
        this.result = step.result ? new Result(step.result) : undefined;
        this.assigns = step.assigns ? step.assigns.map(assign => new Assigns(assign)) : undefined;
    }
}

class ArgValue {
    constructor(arg) {
        this.value = arg.value;
        this.dataType = arg.dataType;
    }
}

class Result {
    constructor(result) {
        this.pointer = result.pointer;
        this.className = result.className ? new ClassName(result.className) : undefined;
        this.version = result.version;
        this.dataType = result.dataType;
        this.value = result.value;
    }
}

class Assigns {
    constructor(assign) {
        this.value = assign.value ? new Result(assign.value) : undefined;
        this.identifier = assign.identifier ? new Identifier(assign.identifier) : undefined;
        this.dataType = assign.dataType;
    }
}

class ClassName {
    constructor(className) {
        this.className = className.className;
        this.packageName = className.packageName;
    }
}

class Identifier {
    constructor(identifier) {
        this.name = identifier.name;
        this.parent = identifier.parent;
        this.dataType = identifier.dataType;
    }
}

function translateToTreeFormat(actualTrace) {
    const elem = actualTrace.trace[0];
    let newTrace = new Trace(actualTrace.trace.slice(1));
    let newTraceElem = null;
    let nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;

    if (actualTrace.trace.length === 0) {
        return [newTrace, null];
    }

    if (elem instanceof Event) {
        let eventId = elem.eventId;
        if (elem.eventType === 'controlFlow') {
            //Function case
            if (elem.kind.type === 'FunctionContext') {
                newTraceElem = new FunctionTrace();
                newTraceElem.name = elem.kind.functionName;

                while (nextEventId !== eventId) {
                    let [returnedTrace, innerStatement] = translateToTreeFormat(newTrace);

                    if (innerStatement != null) {
                        newTraceElem.content.push(innerStatement);
                    }

                    newTrace = returnedTrace;
                    nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;
                }

                newTrace = new Trace(newTrace.trace.slice(1));
            }
        } else if (elem.eventType === 'statement') {
            newTraceElem = new StatementTrace(elem.eventId);

            while (nextEventId !== eventId) {
                let [returnedTrace, innerStatement] = translateToTreeFormat(newTrace);

                if (innerStatement != null) {
                    newTraceElem.content.push(innerStatement)
                }

                newTrace = returnedTrace
                nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;
            }

            newTrace = new Trace(newTrace.trace.slice(1));
        } else if (elem.eventType === 'subStatement') {
            newTraceElem = new SubStatementTrace(elem.eventId);

            while (nextEventId !== eventId) {
                let [returnedTrace, innerStatement] = translateToTreeFormat(newTrace);

                if (innerStatement != null) {
                    newTraceElem.content.push(innerStatement)
                }

                newTrace = returnedTrace
                nextEventId = (newTrace.trace[0] instanceof Event) ? newTrace.trace[0].eventId : -1;
            }

            newTrace = new Trace(newTrace.trace.slice(1));
        }
    } else if (elem instanceof Step) {
        newTraceElem = new StepTrace();
        newTraceElem.lineNumber = 64;
        if (elem.nodeKey) {
            newTraceElem.content = elem.nodeKey;
        }
    }

    return [newTrace, newTraceElem];
}

function parseTraceFromJson(jsonString) {
    const data = JSON.parse(jsonString);

    const trace = data.trace.map(item => {
        if (item.type === 'GroupEvent') {
            return new Event(item);
        } else {
            return new Step(item);
        }
    });

    return new Trace(trace);
}

console.log(translateToTreeFormat(parseTraceFromJson(jsonString)));


export { scopedContextTransform, EventWithContext }
import { Event, EventKind, EventKindTypes, ExecutionStep } from "./event"

type ExecutionWithContext<Context, State> = EventWithContext<Context, State> | ExecutionStep

/**
 * Represents an event with its context and state
 * An event is an ordered list of execution steps
 */
interface EventWithContext<Context, State> {
    type: 'Event',
    context: Context, 
    state: State,
    executions: () => ExecutionWithContext<Context, State>[],
    kind: EventKind,
}

function scopedContextTransform<Context, State>(
    root: Event,
    rootContext: Context,
    aggregate: (event: Event, state: State[]) => State,
    propagate: (event: Event, ctx: Context) => Context
): EventWithContext<Context, State> {

    function helper(event: Event, context: Context): EventWithContext<Context, State> {
        let children : ExecutionWithContext<Context, State>[] = []
        let childStates : State[] = []
        let childContext = propagate(event, context)

        event.executions().forEach(child => {
            switch (child.type) {
                case 'ExecutionStep':
                    children.push(child)
                    break;
                case 'Event':
                    let childWithContext = helper(child,childContext)
                    children.push(childWithContext)

                    switch (child.kind.type) {
                        case EventKindTypes.Flow:
                            break;
                        default:
                            childStates.push(childWithContext.state)
                    }
            }
        })

        return {
            type: 'Event',
            context: context, 
            state: aggregate(event, childStates),
            executions: () => children,
            kind: event.kind,
        }
    }

    return helper(root, rootContext);
}

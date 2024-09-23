import { SourceFormatDescription, parseSourceFormatDescription } from "./event"
import { parseObjectStore, Store } from "./objectStore"
export { 
    initCache,
    sourceCodeCache,
    traceCache,
    objectDataCache,
    Result,
    Success,
    Failure,
    failure,
    success
}

/**
 * Represents the result of an operation
 */
type Result<A> = Success<A> | Failure

/**
 * Represents a successful result
 */
type Success<A> = {
    type: 'success',
    payload: A
}

/**
 * Represents a failed result
 */
type Failure = {
    type: 'failure'
}

/**
 * Represents a data cache
 */
interface DataCache<A> {
    data: () => Result<A>
}

let sourceCode: DataCache<SourceFormatDescription>
let trace: DataCache<any>
let objectData: DataCache<Store>

/**
 * Initialize the cache
 */
async function initCache() {
    sourceCode = await loadAllData(fetchSourceFormat)
    trace = await loadAllData(fetchEventTrace)
    objectData = await loadAllData(fetchSourceObjectData)
}

/**
 * Get the source code cache
 */
function sourceCodeCache(): DataCache<SourceFormatDescription> {
    return sourceCode
}

/**
 * Get the trace cache
 */
function traceCache(): DataCache<any> {
    return trace
}

/**
 * Get the object data cache
 */
function objectDataCache(): DataCache<Store> {
    return objectData
}

/**
 * Load all data
 * @param load the function to load the data
 */
async function loadAllData<A>(load: () => Promise<A>): Promise<DataCache<A>> {

    const payload = await load()
    return {
        data: () => success(payload)
    }

}

/**
 * Fetch the event trace
 */
async function fetchEventTrace() {
    let response = await fetch('eventTrace');
    return response.json()
}

/**
 * Fetch the source format
 */
async function fetchSourceFormat() {
    let response = await fetch('sourceFormat');
    let json: any = await response.json();
    return parseSourceFormatDescription(json)
}

/**
 * Fetch the source object data
 */
async function fetchSourceObjectData() {
    let response = await fetch('objectData');
    let json: any = await response.json();
    return parseObjectStore(json)
}

/**
 * Create a successful result
 * @param data the data to be wrapped
 */
function success<A>(data: A): Success<A> {
    return {
        type: 'success',
        payload: data
    }
}

/**
 * Create a failed result
 */
function failure(): Failure {
    return {
        type: 'failure'
    }
}



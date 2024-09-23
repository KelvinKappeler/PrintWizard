import { InstanceReference, FieldIdentifier, Value, valueFromJson, ArrayReference, DataType } from "./event"
import { Result, failure, success, objectDataCache } from "./fetch"
export { ObjectData, Field, Store, ArrayData, searchObject, parseObjectStore }

//#region types definition
/**
 * An object is a pair of an object reference and a list of fields
 */
type ObjectData = {
    self: InstanceReference,
    fields: Field[]
}

/**
 * A field is a pair of a field identifier and a value
 */
type Field = {
    identifier: FieldIdentifier,
    value: Value
}

/**
 * An array is a pair of an array reference and a list of values
 */
type ArrayData = {
    self : ArrayReference,
    values : Value[]
}

/**
 * A store is a map from object id to a list of object versions
 */
type Store = {
    idToObjects : Map<number, ObjectData[] | ArrayData[]>
}
//#endregion

//#region functions definition
/**
 * Parse the json object into a Store object
 * @param json the json object store
 */
function parseObjectStore(json : any): Store {
    let pointerToVersions : Map<number, ObjectData[]> = new Map() 

    for (const obj of json) {

        if (obj.self.dataType === DataType.InstanceRef) {
            let object = obj as ObjectData
            object.fields = object.fields.map(f => {
                return {
                    identifier: f.identifier,
                    value: valueFromJson(f.value)
                }
            })
        } else if (obj.self.dataType === DataType.ArrayReference) {
            let array = obj as ArrayData
            array.values = array.values.map(v => valueFromJson(v))
        }

        const pointer = obj.self.pointer
        if (!pointerToVersions.has(pointer)) {
            pointerToVersions.set(pointer, [])
        }
    
        let arr = pointerToVersions.get(pointer) as ObjectData[]
        arr.push(obj)
    }
    
    return {
        idToObjects : pointerToVersions
    };

}

/**
 * Search for the object in the object store with version <= ref.version
 * @param ref the reference to the object
 * @returns the object if found, failure otherwise
 */
function searchObject(ref : InstanceReference | ArrayReference): Result<ObjectData | ArrayData> {
    let res: Result<Store> = objectDataCache().data()
    let store: Store
    if (res.type === 'failure') {
        return failure()
    } else {
        store = res.payload
    }
    let versions = store.idToObjects.get(ref.pointer)
    if (versions === undefined) return failure()
    versions = versions as ObjectData[] | ArrayData[]

    let latest : ObjectData | ArrayData = versions[0]
    for (const obj of versions) {
        if (obj.self.version>ref.version) {
            return latest.self.version<=ref.version ? success(latest) : failure();
        }
        latest = obj;
    }
    return success(latest);
}
//#endregion

export class ObjectData {
    constructor(objectData) {
        this.objectData = objectData.map(objectDataNode => new ObjectDataNode(objectDataNode));
        this.stateDictionary = this.createStateDictionary();
    }

    getLastVersion(id, version) {
        const filteredNodes = this.objectData
            .filter(node => node.self.pointer === id && node.self.version <= version);

        if (filteredNodes.length === 0) return null;

        return filteredNodes.reduce((latestNode, currentNode) =>
            currentNode.self.version > latestNode.self.version ? currentNode : latestNode
        );
    }

    createStateDictionary() {
        const uniquePointers = new Set(this.objectData.map(node => node.self.pointer));
        const stateDictionary = new Map();

        for (const pointer of uniquePointers) {
            let objectStates = this.objectData.filter(node => node.self.pointer === pointer);
            objectStates.sort((a, b) => a.self.version - b.self.version);
            stateDictionary.set(pointer, objectStates);
        }

        return stateDictionary;
    }
}

class ObjectDataNode {
    constructor(objectDataNode) {
        this.self = new Self(objectDataNode.self);
        this.fields = objectDataNode.fields.map(f => new Field(f));
    }
}

class Self {
    constructor(self) {
        this.pointer = self.pointer;
        this.className = new ClassName(self.className);
        this.version = self.version;
        this.dataType = self.dataType;
    }
}

class Field {
    constructor(field){
        this.identifier = new Identifier(field.identifier);
        this.value = field.value;
    }
}

class Identifier {
    constructor(identifier) {
        this.name = identifier.name;
        this.owner = identifier.owner;
        this.datatype = identifier.dataType;
    }
}

class ClassName {
    constructor(className) {
        this.className = className.className;
        this.packageName = className.packageName;
    }
}

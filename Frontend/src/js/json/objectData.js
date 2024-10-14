export class ObjectData {
    constructor(objectData) {
        this.objectData = objectData.map(objectDataNode => new ObjectDataNode(objectDataNode));
    }
}

class ObjectDataNode {
    constructor(objectDataNode) {
        this.self = new Self(objectDataNode.self);
        this.fields = objectDataNode.fields;
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

class ClassName {
    constructor(className) {
        this.className = className.className;
        this.packageName = className.packageName;
    }
}

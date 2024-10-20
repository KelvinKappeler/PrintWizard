export class SourceFormat {
    constructor(sourceFormat) {
        this.sourceFile = new SourceFile(sourceFormat.sourceFile);
        this.syntaxNodes = Object.values(sourceFormat.syntaxNodes).map(syntaxNode => new SyntaxNode(syntaxNode));
    }
}

class SourceFile {
    constructor(sourceFile) {
        this.fileName = sourceFile.fileName;
        this.packageName = sourceFile.packageName;
    }
}

class SyntaxNode {
    constructor(syntaxNode) {
        this.endLine = syntaxNode.endLine;
        this.identifier = syntaxNode.identifier;
        this.expression = syntaxNode.expression ? new Expression(syntaxNode.expression) : undefined;
        this.children = syntaxNode.children;
        this.kind = syntaxNode.kind;
        this.prefix = syntaxNode.prefix ? new Prefix(syntaxNode.prefix) : undefined;
        this.startLine = syntaxNode.startLine;
        this.suffix = syntaxNode.suffix ? new Suffix(syntaxNode.suffix) : undefined;
        this.sourceFile = syntaxNode.sourceFile ? new SourceFile(syntaxNode.sourceFile) : undefined;
    }

    getNodeText() {
        if (this.expression == null) {
            return "";
        }
        return this.prefix.text + this.expression.tokens.map(token => token.text).join("") + this.suffix.text;
    }
}

class Expression {
    constructor(expression) {
        this.tokens = expression.tokens.map(token => new Token(token));
        this.kind = expression.kind;
    }
}

class Token {
    constructor(token) {
        this.kind = token.kind;
        this.text = token.text;
    }
}

class Prefix {
    constructor(prefix) {
        this.kind = prefix.kind;
        this.text = prefix.text.trimStart();
    }
}

class Suffix {
    constructor(suffix) {
        this.kind = suffix.kind
        this.text = suffix.text.trimEnd();
    }
}

class sourceFile {
    constructor(sourceFile) {
        this.fileName = sourceFile.fileName;
        this.packageName = sourceFile.packageName;
    }
}

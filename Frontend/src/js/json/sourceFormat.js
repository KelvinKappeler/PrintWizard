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
        this.prefix = syntaxNode.prefix ? new Ix(syntaxNode.prefix) : undefined;
        this.startLine = syntaxNode.startLine;
        this.suffix = syntaxNode.suffix ? new Ix(syntaxNode.suffix) : undefined;
        this.sourceFile = syntaxNode.sourceFile ? new SourceFile(syntaxNode.sourceFile) : undefined;
    }
}

class Expression {
    constructor(expression) {
        this.tokens = new Tokens(expression.tokens);
        this.kind = expression.kind;
    }
}

class Tokens {
    constructor(tokens) {
        this.tokens = tokens.map(token => new Token(token));
    }
}

class Token {
    constructor(token) {
        this.kind = token.kind;
        this.text = token.text;
    }
}

class Ix {
    constructor(ix) {
        this.kind = ix.kind;
        this.text = ix.text;
    }
}

class sourceFile {
    constructor(sourceFile) {
        this.fileName = sourceFile.fileName;
        this.packageName = sourceFile.packageName;
    }
}

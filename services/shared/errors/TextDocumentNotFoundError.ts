export class TextDocumentNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TextDocumentNotFoundError';
    }
}

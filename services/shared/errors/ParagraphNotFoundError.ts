export class ParagraphNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParagraphNotFoundError';
    }
}

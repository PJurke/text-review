export class HighlightNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HighlightNotFoundError';
    }
}

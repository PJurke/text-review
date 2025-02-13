export class TextAnalysisNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TextAnalysisNotFoundError';
    }
}

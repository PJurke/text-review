export class ValidationError extends Error {

    /** The field which failed validation */
    public field: string;

    constructor(message: string, field: string) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

}
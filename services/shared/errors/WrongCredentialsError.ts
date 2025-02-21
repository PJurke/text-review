export class WrongCredentialsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WrongCredentialsError';
    }
}

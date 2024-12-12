export class InvalidDocumentIdError extends Error {

    constructor(message: string = 'Invalid Document ID') {
        super(message);
        this.name = 'InvalidDocumentIdError';
    }

}

export class DocumentNotFoundError extends Error {

    constructor(message: string = 'Document Not Found') {
        super(message);
        this.name = 'DocumentNotFoundError';
    }
    
}

export class InternalServerError extends Error {

    constructor(message: string = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
    }

}
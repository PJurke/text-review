import { env } from "process";
import { MongoError, ObjectId } from "mongodb";
import logger from "@/lib/logger";
import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { mapTextDocumentEntityToTextDocument } from "@/shared/TextDocumentMapper";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

export default async function getTextDocument(id: string): Promise<TextDocument> {
    
    // 1. Validate all arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(id);

    if (!validationResult.success)
            throw new ValidationError('Invalid text document id', 'textDocumentId');

    // 2. Mapping (GraphQL -> MongoDB)

    const documentOId = new ObjectId(id);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.MONGODB_DATABASE_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocumentEntity = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: documentOId });

        if (!textDocumentEntity)
            throw new TextDocumentNotFoundError(`Text document with id ${id} not found`);

        // 5. Map TextDocumentEntity to TextDocument

        const textDocument = mapTextDocumentEntityToTextDocument(textDocumentEntity);

        // 6. Return TextDocument

        return textDocument;

    } catch(error: unknown) {

        if (error instanceof TextDocumentNotFoundError) {
            throw error;
        } else if (error instanceof MongoError) {
            logger.error('get-text-document-logic.ts: Database error ', error);
            throw new DatabaseError('An internal server error occurred');
        } else if (error instanceof Error) {
            logger.error('get-text-document-logic.ts: ', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } else {
            logger.error('get-text-document-logic.ts: Unknown error ', error);
            throw new Error('An unknown error occurred');
        }

    }

}
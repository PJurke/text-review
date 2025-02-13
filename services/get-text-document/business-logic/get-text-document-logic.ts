import { env } from "process";
import { ObjectId } from "mongodb";
import logger from "@/lib/logger";
import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { mapTextDocumentEntityToTextDocument } from "@/shared/TextDocumentMapper";

export default async function getTextDocument(id: string): Promise<TextDocument> {
    
    // 1. Validate all arguments

    TextDocumentSchema.shape.id.parse(id);

    // 2. Mapping (GraphQL -> MongoDB)

    const documentId = new ObjectId(id);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocumentEntity = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: documentId })

        if (!textDocumentEntity)
            throw new TextDocumentNotFoundError(`Text document with id ${id} not found`);

        // 5. Map TextDocumentEntity to TextDocument

        const textDocument = mapTextDocumentEntityToTextDocument(textDocumentEntity);

        // 6. Return TextDocument

        return textDocument;

    } catch (error) {

        logger.error('Error retrieving document:', error);
        throw error;

    }

}
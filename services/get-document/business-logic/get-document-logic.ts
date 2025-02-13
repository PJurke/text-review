import { env } from "process";
import { ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import { DocumentNotFoundError } from "@/services/shared/errors/DocumentNotFoundError";
import { mapTextDocumentEntityToTextDocument } from "@/shared/TextDocumentMapper";
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import logger from "@/lib/logger";

export default async function getDocument(id: string): Promise<TextDocument> {

    // 1. Validate all arguments

    TextDocumentSchema.shape.id.parse(id)

    // 2. Mapping (GraphQL -> MongoDB)

    const documentId = new ObjectId(id);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const document = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: documentId })

        if (!document)
            throw new DocumentNotFoundError(`Document with id ${id} not found`);

        // 5. Map Text Document (MongoDB -> GraphQL)

        return mapTextDocumentEntityToTextDocument(document);

    } catch (error) {

        logger.error('Error retrieving document:', error);
        throw error;

    }

}
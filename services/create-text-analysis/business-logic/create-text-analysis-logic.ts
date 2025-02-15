import { env } from "process";
import { MongoError, ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mongo/mongodb";
import { TextDocumentSchema } from "@/types/TextDocument";
import TextAnalysisEntity from "@/entities/TextAnalysisEntity";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import logger from "@/lib/logger";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

interface createTextAnalysisResponse {
    textAnalysisId: string;
}

export default async function createTextAnalysis(textDocumentId: string): Promise<createTextAnalysisResponse> {

    // 1. Validate arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(textDocumentId);

    if (!validationResult.success)
        throw new ValidationError('Invalid text document id', 'text document id');

    // 2. Mapping (GraphQL -> MongoDB)

    const textDocumentOid = new ObjectId(textDocumentId);

    try {

        // 3. Establish database connection

        const client = await clientPromise;
        const db = client.db(env.DB_NAME || 'text-review-db');

        // 4. Check if referred TextDocument exists

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textDocumentOid });
        
        if (!textDocument)
            throw new TextDocumentNotFoundError(`Text document with id ${textDocumentId} not found`);

        // 5. Create and add new TextAnalysis

        const newTextAnalysis: TextAnalysisEntity = {
            _id: new ObjectId(),
            textDocumentId: textDocumentOid,
            paragraphAnalyses: []
        };

        const result = await db.collection<TextAnalysisEntity>('textAnalyses').insertOne(newTextAnalysis);

        // 6. Return the newly created TextAnalysis id

        return {
            textAnalysisId: result.insertedId.toHexString()
        };

    } catch(error: unknown) {

        if (error instanceof MongoError) {
            logger.error('create-text-analysis-logic.ts: Database error ', error);
            throw new DatabaseError('');
        } else if (error instanceof Error) {
            logger.error('create-text-analysis-logic.ts: ', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } else {
            logger.error('create-text-analysis-logic.ts: Unknown error ', error);
            throw new Error('An unknown error occurred');
        }

    }

}
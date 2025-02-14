import { env } from "process";
import { ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mongo/mongodb";
import { TextDocumentSchema } from "@/types/TextDocument";
import TextAnalysisEntity from "@/entities/TextAnalysisEntity";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import logger from "@/lib/logger";

interface createTextAnalysisResponse {
    textAnalysisId: string;
}

export default async function createTextAnalysis(textDocumentId: string): Promise<createTextAnalysisResponse> {

    // 1. Validate arguments

    TextDocumentSchema.shape.id.parse(textDocumentId);

    // 2. Mapping (GraphQL -> MongoDB)

    const textDocumentOid = new ObjectId(textDocumentId);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textDocumentOid });
        
        if (!textDocument) {
            throw new TextDocumentNotFoundError('');
        }

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

    } catch(error) {

        logger.error('create-text-analysis-logic.ts: ', error);
        throw error;

    }

}
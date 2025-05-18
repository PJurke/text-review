import { getMongoDb } from "@/app/lib/mongo/mongodb";
import TextDocumentSummaryEntity from "@/entities/TextDocumentSummaryEntity";
import logger from "@/lib/logger";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import { mapTextDocumentSummaryEntityToTextDocumentSummary } from "@/shared/TextDocumentSummaryMapper";
import { TextDocumentSummary } from "@/types/TextDocumentSummary";
import { MongoError } from "mongodb";

export default async function listTextDocuments(): Promise<TextDocumentSummary[]> {

    try {

        // 1. Establish database connection

        const db = await getMongoDb();

        // 2. Get all text documents
        
        const textDocumentSummaryEntities = await db
            .collection<TextDocumentSummaryEntity>('textDocuments')
            .find({})
            .toArray();

        // 3. Map TextDocumentSummaryEntity to TextDocumentSummary

        const textDocumentSummaries = textDocumentSummaryEntities.map(mapTextDocumentSummaryEntityToTextDocumentSummary);

        // 4. Return TextDocumentSummary List

        return textDocumentSummaries;

    } catch(error: unknown) {

        if (error instanceof MongoError) {
            logger.error('list-text-documents-logic.ts: Database error ', error);
            throw new DatabaseError('An internal server error occurred');
        } else if (error instanceof Error) {
            logger.error('list-text-documents-logic.ts: ', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } else {
            logger.error('list-text-documents-logic.ts: Unknown error ', error);
            throw new Error('An unknown error occurred');
        }

    }

}
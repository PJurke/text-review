import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentSummaryEntity from "@/entities/TextDocumenSummaryEntity";
import logger from "@/lib/logger";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import { mapTextDocumentSummaryEntityToTextDocumentSummary } from "@/shared/TextDocumentSummaryMapper";
import { TextDocumentSummary } from "@/types/TextDocumentSummary";
import { MongoError } from "mongodb";
import { env } from "process";

export default async function listTextDocuments(): Promise<TextDocumentSummary[]> {

    try {

        // 1. Establish database connection

        const client = await clientPromise;
        const db = client.db(env.MONGODB_DATABASE_NAME || 'text-review-db');

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
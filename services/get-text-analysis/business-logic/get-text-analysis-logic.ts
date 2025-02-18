import { env } from "process";
import { MongoError, ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import logger from "@/lib/logger";
import TextAnalysis, { TextAnalysisSchema } from "@/types/TextAnalysis";
import TextAnalysisEntity from "@/entities/TextAnalysisEntity";
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError";
import ParagraphAnalysisEntity from "@/entities/ParagraphAnalysisEntity";
import Highlight from "@/types/Highlight";
import ParagraphAnalysis from "@/types/ParagraphAnalysis";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

function mergeTextAnalysis(textDocumentEntity: TextDocumentEntity, textAnalysisEntity: TextAnalysisEntity): TextAnalysis {

    const paragraphAnalysisMap = new Map<string, ParagraphAnalysisEntity>();

    textAnalysisEntity.paragraphAnalyses.forEach(paragraphAnalysis => {
        paragraphAnalysisMap.set(paragraphAnalysis.paragraphId.toHexString(), paragraphAnalysis)
    });

    const paragraphs: ParagraphAnalysis[] = textDocumentEntity.paragraphs.map(paragraph => {
        const analysisForParagraph = paragraphAnalysisMap.get(paragraph._id.toHexString());

        const highlights: Highlight[] = analysisForParagraph ? analysisForParagraph.highlights.map(h => ({ id: h._id.toString(), start: h.start, end: h.end })) : [];
        
        return {
            id: paragraph._id.toHexString(),
            text: paragraph.text,
            highlights: highlights
        };
    });

    return {
        id: textDocumentEntity._id.toHexString(),
        title: textDocumentEntity.title,
        author: textDocumentEntity.author,
        paragraphs: paragraphs
    };
}

export default async function getTextAnalysis(id: string): Promise<TextAnalysis> {

    // 1. Validate all arguments

    const validationResult = TextAnalysisSchema.shape.id.safeParse(id);

    if (!validationResult.success)
        throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    // 2. Mapping (GraphQL -> MongoDB)

    const analysisOId = new ObjectId(id);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextAnalysis exists

        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalyses')
            .findOne({ _id: analysisOId });

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError(`Text Analysis with id ${id} not found`);

        // 5. Use Text Document Reference to retrieve Text Document

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textAnalysis.textDocumentId });

        if (!textDocument)
            throw new TextDocumentNotFoundError(`Text Document with id ${id} not found`);

        // 6. Merge TextAnalysisEntity and TextDocumentEntity into Text Analysis

        const response: TextAnalysis = mergeTextAnalysis(textDocument, textAnalysis);

        // 7. Return TextAnalysis

        return response;

    } catch (error: unknown) {

        if (error instanceof MongoError) {
            logger.error('get-text-analysis-logic.ts: Database error ', error);
            throw new DatabaseError('An internal server error occurred');
        } else if (error instanceof Error) {
            logger.error('get-text-analysis-logic.ts: ', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } else {
            logger.error('get-text-analysis-logic.ts: Unknown error ', error);
            throw new Error('An unknown error occurred');
        }

    }

}
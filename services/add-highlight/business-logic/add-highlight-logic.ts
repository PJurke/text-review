import { env } from "process"
import { MongoError, ObjectId, UpdateResult } from "mongodb"
import { z } from "zod"

import clientPromise from "@/app/lib/mongo/mongodb"
import logger from "@/lib/logger"

import Highlight, { HighlightSchema } from '@/types/Highlight'
import { TextAnalysisSchema } from "@/types/TextAnalysis"
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import HighlightEntity from "@/entities/HighlightEntity"
import TextAnalysisEntity from "@/entities/TextAnalysisEntity"
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError"
import TextDocumentEntity from "@/entities/TextDocumentEntity"
import { ValidationError } from "@/services/shared/errors/ValidationError"
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError"
import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError"
import { DatabaseError } from "@/services/shared/errors/DatabaseError"


interface AddHighlightArgs {
    textAnalysisId: string,
    paragraphId: string,
    start: number,
    end: number
}

const AddHighlightArgsSchema = z.object({
    textAnalysisId: TextAnalysisSchema.shape.id,
    paragraphId: ParagraphAnalysisSchema.shape.id,
    start: HighlightSchema.shape.start,
    end: HighlightSchema.shape.end
});

export default async function addHighlight(args: AddHighlightArgs): Promise<Highlight> {

    // 1. Validate arguments

    const validationResult = AddHighlightArgsSchema.safeParse(args);

    if (!validationResult.success)
        throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    // 2. Mapping (GraphQL -> MongoDB)

    const textAnalysisId = new ObjectId(args.textAnalysisId);
    const paragraphId = new ObjectId(args.paragraphId);

    const newHighlight: HighlightEntity = {
        _id: new ObjectId(),
        start: args.start,
        end: args.end
    }

    try {

        // 3. Establish database connection

        const client = await clientPromise;
        const db = client.db(env.DB_NAME || 'text-review-db');

        // 4. Check if referred TextAnalysis exists

        const textAnalysisFilter = {
            _id: textAnalysisId
        };
        
        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalyses')
            .findOne(textAnalysisFilter);

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError(`Text analysis with id ${textAnalysisId} not found`);

        // 5. Check if Paragraph exists on TextDocument side

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textAnalysis.textDocumentId });

        // This is possible, but shouldn't happen. It would reflect a wrong doc reference
        if (!textDocument) {
            logger.error(`add-highlight-logic.ts: Referred text document with id ${textAnalysis.textDocumentId} not found`);
            throw new TextDocumentNotFoundError(`The referred TextDocument with id ${textAnalysis.textDocumentId} does not exist`);
        }

        const referredParagraphExists = textDocument.paragraphs.some(paragraph => paragraph._id.equals(paragraphId));

        if (!referredParagraphExists)
            throw new ParagraphNotFoundError(`The referred paragraph with id ${paragraphId} does not exist`);

        // 6. Check if Paragraph exists on TextAnalysis side - otherwise, just create it

        const paragraphAnalysis = textAnalysis.paragraphAnalyses.find(paragraphAnalysis => paragraphAnalysis.paragraphId.equals(paragraphId));

        let update;
        let filter;

        // Check if analysis for the referred paragraph already exists - create if not

        if (paragraphAnalysis) {

            filter = { _id: textAnalysisId, "paragraphAnalyses.paragraphId": paragraphId }
            update = { $push: { "paragraphAnalyses.$.highlights": newHighlight } };

        } else {

            filter = { _id: textAnalysisId };
            update = {
                $push: {
                    paragraphAnalyses: {
                        paragraphId: paragraphId,
                        highlights: [newHighlight]
                    }
                }
            }

        }

        // 7. Add new highlight

        const result: UpdateResult = await db.collection<TextAnalysisEntity>('textAnalyses').updateOne(filter, update)

        if (!result.acknowledged || result.modifiedCount != 1) {
            logger.error('add-highlight-logic.ts: Add new highlight operation failed');
            throw new DatabaseError('Adding the new highlight failed');
        }

        // 8. Return the new highlight

        return {
            id: newHighlight._id.toHexString(),
            start: newHighlight.start,
            end: newHighlight.end
        };

    } catch(error: unknown) {

        if (error instanceof MongoError) {
            logger.error('create-text-analysis-logic.ts: Database error ', error);
            throw new DatabaseError('');
        } else {
            logger.error('add-highlight-logic.ts: ', error);
            throw error;
        }
    }

}
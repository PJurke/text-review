import { env } from "process"
import { ObjectId, UpdateResult } from "mongodb"
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

    AddHighlightArgsSchema.parse(args);

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

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextAnalysis exists

        const textAnalysisFilter = {
            _id: textAnalysisId
        }
        
        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalyses')
            .findOne(textAnalysisFilter);

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError('The given textAnalysisId does not exist');

        // 5. Check if Paragraph exists on TextDocument side

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textAnalysis.textDocumentId });

        if (!textDocument)
            throw new Error('The referred TextDocument does not exist - this should not happen');

        const referredParagraphExists = textDocument.paragraphs.some(paragraph => paragraph._id.equals(paragraphId));

        if (!referredParagraphExists)
            throw new Error('The referred paragraph does not exist on the referred TextDocument');

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

        // 8. Return the new highlight

        if (result.acknowledged)
            return {
                id: newHighlight._id.toHexString(),
                start: newHighlight.start,
                end: newHighlight.end
            };

        throw new Error('An error occurred while adding a highlight');

    } catch(error) {
        logger.error('An error occurred while adding a highlight:', error);
        throw error;
    }

}
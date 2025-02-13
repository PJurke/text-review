import { env } from "process"
import { ObjectId, UpdateResult } from "mongodb"
import { z } from "zod"

import clientPromise from "@/app/lib/mongo/mongodb"
import logger from "@/lib/logger"

import { ParagraphNotFoundError } from "../../shared/errors/ParagraphNotFoundError"

import Highlight, { HighlightSchema } from '@/types/Highlight'
import { TextAnalysisSchema } from "@/types/TextAnalysis"
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import HighlightEntity from "@/entities/HighlightEntity"
import TextAnalysisEntity from "@/entities/TextAnalysisEntity"
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError"


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
            _id: textAnalysisId,
            "paragraphAnalyses.paragraphId": paragraphId
        }
        
        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalysis')
            .findOne(textAnalysisFilter);

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError('The given textAnalysisId does not exist');

        // 4. Check if referred ParagraphId exists

        const paragraphExists = textAnalysis.paragraphAnalyses.some(paragraphAnalysis => paragraphAnalysis.paragraphId.equals(paragraphId));

        if (!paragraphExists)
            throw new ParagraphNotFoundError('The given paragraphId does not exist');

        // 5. Design update filter
        
        const update = {
            $push: {
                "paragraphAnalyses.$.highlights": newHighlight
            }
        }

        // 5. Add new highlight

        const result: UpdateResult = await db.collection<TextAnalysisEntity>('textAnalysis').updateOne(textAnalysisFilter, update)

        // 6. Return the new highlight

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
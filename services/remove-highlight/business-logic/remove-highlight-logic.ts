import { env } from "process"
import { z } from "zod"
import clientPromise from "@/app/lib/mongo/mongodb"
import { ObjectId, UpdateResult } from "mongodb"

import { HighlightSchema } from '@/types/Highlight'
import { HighlightNotFoundError } from "@/services/shared/errors/HighlightNotFoundError"
import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError"
import logger from "@/lib/logger"
import { TextAnalysisSchema } from "@/types/TextAnalysis"
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import TextAnalysisEntity from "@/entities/TextAnalysisEntity"
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError"

interface RemoveHighlightArgs {
    textAnalysisId: string
    paragraphId: string
    highlightId: string
}

interface RemoveHighlightEntity {
    textAnalysisId: ObjectId
    paragraphId: ObjectId
    highlightId: ObjectId
}

const RemoveHighlightArgsSchema = z.object({
    textAnalysisId: TextAnalysisSchema.shape.id,
    paragraphId: ParagraphAnalysisSchema.shape.id,
    highlightId: HighlightSchema.shape.id
});

export default async function removeHighlight(args: RemoveHighlightArgs): Promise<boolean> {

    // 1. Validate arguments

    RemoveHighlightArgsSchema.parse(args);

    // 2. Map data structure (GraphQL > Mongo)

    const removableHighlight: RemoveHighlightEntity = {
        textAnalysisId: new ObjectId(args.textAnalysisId),
        paragraphId: new ObjectId(args.paragraphId),
        highlightId: new ObjectId(args.highlightId)
    }

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextAnalysis exists

        const textAnalysisFilter = { _id: removableHighlight.textAnalysisId };
        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalysis')
            .findOne(textAnalysisFilter);

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError('The given textAnalysisId does not exist');

        // 5. Check if referred Paragraph exists

        const paragraphAnalysis = textAnalysis.paragraphAnalyses.find((p) =>
            p.paragraphId.equals(removableHighlight.paragraphId)
          );

        if (!paragraphAnalysis)
            throw new ParagraphNotFoundError('The given paragraphId does not exist');

        // 6. Check if referred HighlightId exists

        const highlightExists = paragraphAnalysis.highlights.some((highlight) =>
            highlight._id.equals(removableHighlight.highlightId)
          );

        if (!highlightExists)
            throw new HighlightNotFoundError('The given highlightId does not exist');

        // 7. Design update filter
        
        const update = {
            $pull: {
                "paragraphAnalyses.$[para].highlights": {
                    _id: removableHighlight.highlightId
                }
            }
        }

        const arrayFilters = [{ "para.paragraphId": removableHighlight.paragraphId }];

        // 8. Remove highlight

        const result: UpdateResult = await db
            .collection<TextAnalysisEntity>('textAnalysis')
            .updateOne(textAnalysisFilter, update, { arrayFilters });

        if (result.acknowledged)
            return true;

        throw new Error('An error occurred while removing a highlight');

    } catch(error) {
        logger.error('An error occurred while removing a highlight:', error);
        throw error;
    }

}
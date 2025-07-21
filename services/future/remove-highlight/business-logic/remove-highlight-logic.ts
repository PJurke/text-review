import { z } from "zod"

import logger from "@/lib/logger"
import prisma from "@/lib/prisma";

import { HighlightSchema } from '@/types/Highlight'
import { HighlightNotFoundError } from "@/services/shared/errors/HighlightNotFoundError"
import { TextAnalysisSchema } from "@/types/TextAnalysis"
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import { ValidationError } from "@/services/shared/errors/ValidationError"

interface RemoveHighlightArgs {
    textAnalysisId: string
    paragraphId: string
    highlightId: string
}

const RemoveHighlightArgsSchema = z.object({
    textAnalysisId: TextAnalysisSchema.shape.id,
    paragraphId: ParagraphAnalysisSchema.shape.id,
    highlightId: HighlightSchema.shape.id
});

export default async function removeHighlight(args: RemoveHighlightArgs): Promise<boolean> {

    // 1. Validate arguments

    const validationResult = RemoveHighlightArgsSchema.safeParse(args);
    
    if (!validationResult.success)
            throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    const { textAnalysisId, paragraphId, highlightId } = validationResult.data;

    try {

        // deleteMany does not fail if the record has already been deleted
        // where ensures that only delete the exact highlight in the correct context

        const deleteResult = await prisma.highlight.deleteMany({
            where: {
                id: highlightId,
                // Make sure that the highlight belongs to the correct ParagraphAnalysis,
                // which in turn belongs to the correct TextAnalysis.
                analysis: {
                    paragraphId: paragraphId,
                    analysisId: textAnalysisId,
                },
            },
        });

        // Check whether a highlight has actually been deleted.

        if (deleteResult.count === 0) {
            throw new HighlightNotFoundError(`Highlight with id ${highlightId} not found in the specified context.`);
        }

        return true;

    } catch (error) {

        logger.error('remove-highlight-logic.ts:', error);
        throw error;

    }

}
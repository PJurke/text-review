import { z } from "zod"

import logger from "@/lib/logger"
import prisma from "@/lib/prisma";

import Highlight, { HighlightSchema } from '@/types/Highlight'
import { TextAnalysisSchema } from "@/types/TextAnalysis"
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError"
import { ValidationError } from "@/services/shared/errors/ValidationError"
import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError"
import { Prisma } from "@prisma/client";

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

    // 2. Destructure validated arguments

    const { textAnalysisId, paragraphId, start, end } = args;

    try {

        // 3. Prepare and execute transaction

        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            
            // 4. Check if referred TextAnalysis exists

            const textAnalysis = await tx.textAnalysis.findUnique({
                where: { id: textAnalysisId },
                select: { id: true }
            });

            if (!textAnalysis)
                throw new TextAnalysisNotFoundError(`Text analysis with id ${textAnalysisId} not found`);

            // 5. Check if Paragraph exists on TextDocument side

            const paragraph = await tx.paragraph.findUnique({
                where: { id: paragraphId },
                select: { id: true }
            });

            if (!paragraph) {
                throw new ParagraphNotFoundError(`The referred paragraph with id ${paragraphId} does not exist`);
            }

            // 6. Check if Paragraph exists on TextAnalysis side - otherwise, just create it

            let paragraphAnalysis = await tx.paragraphAnalysis.findFirst({
                where: {
                    analysisId: textAnalysisId,
                    paragraphId: paragraphId,
                }
            });

            if (!paragraphAnalysis) {
                paragraphAnalysis = await tx.paragraphAnalysis.create({
                    data: {
                        analysisId: textAnalysisId,
                        paragraphId: paragraphId,
                    }
                });
            }

            // 7. Create new highlight

            const newHighlight = await tx.highlight.create({
                data: {
                    start: start,
                    end: end,
                    analysisId: paragraphAnalysis.id
                }
            });

            return newHighlight;

        });

    } catch (error: unknown) {

        logger.error('add-highlight-logic.ts:', error);
        throw error;

    }

}
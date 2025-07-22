import { z } from "zod"

import { Prisma, Highlight } from "@prisma/client";
import logger from "@/lib/logger"
import prisma from "@/lib/prisma";

import { HighlightSchema } from '@/types/Highlight'
import { ParagraphAnalysisSchema } from "@/types/ParagraphAnalysis"
import { TextAnalysisSchema } from "@/types/TextAnalysis"

import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError"
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError"
import { ValidationError } from "@/services/shared/errors/ValidationError"

const AddHighlightInputSchema = z.object({
    textAnalysisId: TextAnalysisSchema.shape.id,
    paragraphId: ParagraphAnalysisSchema.shape.id,
    start: HighlightSchema.shape.start,
    end: HighlightSchema.shape.end
});

type AddHighlightInput = z.infer<typeof AddHighlightInputSchema>;

export default async function addHighlight(args: AddHighlightInput): Promise<Highlight> {

    // 1. Validate arguments

    const validationResult = AddHighlightInputSchema.safeParse(args);

    if (!validationResult.success)
        throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    // 2. Destructure validated arguments

    const { textAnalysisId, paragraphId, start, end } = validationResult.data;

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

            if (!paragraph)
                throw new ParagraphNotFoundError(`The referred paragraph with id ${paragraphId} does not exist`);

            // 6. Check if Paragraph exists on TextAnalysis side - otherwise, just create it

            let paragraphAnalysis = await tx.paragraphAnalysis.findFirst({
                where: {
                    textAnalysisId: textAnalysisId,
                    paragraphId: paragraphId,
                }
            });

            if (!paragraphAnalysis) {
                paragraphAnalysis = await tx.paragraphAnalysis.create({
                    data: {
                        textAnalysisId: textAnalysisId,
                        paragraphId: paragraphId,
                    }
                });
            }

            // 7. Create new highlight

            const newHighlight = await tx.highlight.create({
                data: {
                    start: start,
                    end: end,
                    textAnalysisId: paragraphAnalysis.id
                }
            });

            return newHighlight;

        });

    } catch (error: unknown) {

        logger.error('add-highlight-logic.ts:', error);
        throw error;

    }

}
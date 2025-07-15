import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import { TextDocumentSchema } from "@/types/TextDocument";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { ValidationError } from "@/services/shared/errors/ValidationError";

interface createTextAnalysisResponse {
    textAnalysisId: string;
}

export default async function createTextAnalysis(textDocumentId: string): Promise<createTextAnalysisResponse> {

    // 1. Validate arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(textDocumentId);

    if (!validationResult.success)
        throw new ValidationError('Invalid text document id', 'textDocumentId');

    try {

        // 2. Check if referred TextDocument exists

        const textDocument = await prisma.textDocument.findUnique({
            where: {
                id: textDocumentId,
            },
            select: { id: true }
        });

        if (!textDocument) {
            throw new TextDocumentNotFoundError(`Text document with id ${textDocumentId} not found`);
        }

        // 3. Create and add new TextAnalysis

        const newTextAnalysis = await prisma.textAnalysis.create({
            data: {
                textDocumentId: textDocumentId,
                // paragraphAnalyses is empty by default
                paragraphAnalyses: {
                    create: []
                }
            }
        });

        // 4. Return the newly created TextAnalysis id

        return {
            textAnalysisId: newTextAnalysis.id
        };

    } catch (error: unknown) {

        logger.error('create-text-analysis-logic.ts: Database error', error);
        throw error;

    }

}
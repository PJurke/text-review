import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import TextAnalysis, { TextAnalysisSchema } from "@/types/TextAnalysis";
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError";
import ParagraphAnalysis from "@/types/ParagraphAnalysis";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { ValidationError } from "@/services/shared/errors/ValidationError";

export default async function getTextAnalysis(id: string): Promise<TextAnalysis> {

    // 1. Validate all arguments

    const validationResult = TextAnalysisSchema.shape.id.safeParse(id);

    if (!validationResult.success)
        throw new ValidationError('Invalid input', validationResult.error.issues.map(issue => issue.path.join('.')).join(', '));

    try {

        // 2. Use Prisma to retrieve the Text Analysis and its related data

        const analysisData = await prisma.textAnalysis.findUnique({
            where: { id: id },
            include: {
                // Load the corresponding text document with all its paragraphs
                textDocument: {
                    include: {
                        paragraphs: true,
                    },
                },
                // Load the corresponding paragraph analyses with their highlights
                paragraphAnalyses: {
                    include: {
                        highlights: true,
                    },
                },
            },
        });

        // 3. Check if the analysis data was found

        if (!analysisData) {
            throw new TextAnalysisNotFoundError(`Text Analysis with id ${id} not found`);
        }

        // 4. Check if the text document exists in the analysis data

        if (!analysisData.textDocument) {
            // Should not happen thanks to schema constraints, but is a good safeguard
            throw new TextDocumentNotFoundError(`Referred Text Document for analysis ${id} not found`);
        }

        // 5. Convert the data retrieved by Prisma into the final response format

        const paragraphAnalysesMap = new Map(
            analysisData.paragraphAnalyses.map(pa => [pa.paragraphId, pa.highlights])
        );

        const paragraphs: ParagraphAnalysis[] = analysisData.textDocument.paragraphs.map(paragraph => {
            const highlights = paragraphAnalysesMap.get(paragraph.id) || [];
            return {
                id: paragraph.id,
                text: paragraph.text,
                highlights: highlights.map(h => ({ id: h.id, start: h.start, end: h.end })),
            };
        });

        const response: TextAnalysis = {
            id: analysisData.id,
            title: analysisData.textDocument.title,
            author: analysisData.textDocument.author,
            paragraphs: paragraphs
        };

        return response;

    } catch (error: unknown) {

        logger.error('get-text-analysis-logic.ts: Unknown error ', error);
        throw error;

    }

}
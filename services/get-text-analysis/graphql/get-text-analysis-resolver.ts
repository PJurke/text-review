import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { ZodError } from "zod";

import logger from "@/lib/logger";

import TextAnalysis from "@/types/TextAnalysis";
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError";
import getTextAnalysis from "../business-logic/get-text-analysis-logic";

export interface GetTextAnalysisData {
    id: string
}

export default async function getTextAnalysisResolver(_parent: unknown, args: GetTextAnalysisData, context: any, _info: GraphQLResolveInfo): Promise<TextAnalysis> {

    try {

        const { id } = args
        return await getTextAnalysis(id)

    } catch (error) {

        if (error instanceof TextAnalysisNotFoundError) {
            throw new GraphQLError('Text analysis not found', {
                extensions: { code: 'TEXT_ANALYSIS_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ZodError) {
            throw new GraphQLError('Invalid input', {
                extensions: { code: 'INVALID_INPUT', details: error.errors },
            });
        }

        logger.error('Error getting analysis:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
import { GraphQLError, GraphQLResolveInfo } from "graphql";

import logger from "@/lib/logger";

import TextAnalysis from "@/types/TextAnalysis";
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError";
import getTextAnalysis from "../business-logic/get-text-analysis-logic";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

export interface GetTextAnalysisData {
    id: string
}

export default async function getTextAnalysisResolver(_parent: unknown, args: GetTextAnalysisData, context: any, _info: GraphQLResolveInfo): Promise<TextAnalysis> {

    try {

        const { id } = args
        return await getTextAnalysis(id)

    } catch (error) {

        if (error instanceof ValidationError)
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', argumentName: error.field } });
        else if (error instanceof TextAnalysisNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_ANALYSIS_NOT_FOUND', details: error.message } });
        else if (error instanceof TextDocumentNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND', details: error.message } });
        else if (error instanceof DatabaseError)
            throw new GraphQLError(error.message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        else {
            logger.error('get-text-analysis-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }

    }

}
import logger from "@/lib/logger";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import createTextAnalysis from "../business-logic/create-text-analysis-logic";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

interface CreateTextAnalysisData {
    textDocumentId: string;
}

interface CreateTextAnalysisResponse {
    id: string;
}

export default async function createTextAnalysisResolver(_parent: unknown, args: CreateTextAnalysisData, context: any, _info: GraphQLResolveInfo): Promise<CreateTextAnalysisResponse> {

    try {

        // 1. Call business logic

        const textAnalysisId = (await createTextAnalysis(args.textDocumentId)).textAnalysisId

        // 2. Return newly created text analysis id

        return {
            id: textAnalysisId
        };

    } catch(error) {

        if (error instanceof ValidationError) {
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', argumentName: error.field } });
        } else if (error instanceof TextDocumentNotFoundError) {
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND' } });
        } else if (error instanceof DatabaseError) {
            throw new GraphQLError(error.message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        } else {
            logger.error('create-text-analysis-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }

    }

}
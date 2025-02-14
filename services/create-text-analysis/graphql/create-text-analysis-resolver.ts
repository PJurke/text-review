import logger from "@/lib/logger";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import createTextAnalysis from "../business-logic/create-text-analysis-logic";

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

        logger.error('create-text-analysis-resolver.ts: ', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
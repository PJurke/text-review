import { GraphQLResolveInfo } from "graphql";
import logger from "@/lib/logger";

import listTextDocuments from "./list-text-documents.service";
import { createApiError } from "@/services/shared/graphql/errors";
import { TextDocumentSummary } from "@/lib/graphql/generated/graphql";

export default async function listTextDocumentsResolver(_parent: unknown, args: null, context: any, _info: GraphQLResolveInfo): Promise<TextDocumentSummary[]> {

    logger.info('listTextDocuments: Resolver invoked');

    try {

        // No mapping needed here as the service already returns an optimized type
        return await listTextDocuments();

    } catch(error) {
        throw createApiError(error);
    }

}
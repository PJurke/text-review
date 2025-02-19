import { GraphQLError, GraphQLResolveInfo } from "graphql";

import { TextDocumentSummary } from "@/types/TextDocumentSummary";
import listTextDocuments from "../business-logic/list-text-documents-logic";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import logger from "@/lib/logger";

export default async function listTextDocumentsResolver(_parent: unknown, args: null, context: any, _info: GraphQLResolveInfo): Promise<TextDocumentSummary[]> {
    
    try {

        return await listTextDocuments();

    } catch(error) {
        
        if (error instanceof DatabaseError)
            throw new GraphQLError(error.message, { extensions: { code: 'INTERNAL_SERVER_ERROR', details: error.message } });
        else {
            logger.error('list-text-documents-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }
        
    }

}
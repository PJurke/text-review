import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import removeHighlight from '../business-logic/remove-highlight-logic';

import { ParagraphNotFoundError } from '@/services/shared/errors/ParagraphNotFoundError';
import { HighlightNotFoundError } from '@/services/shared/errors/HighlightNotFoundError';
import logger from '@/lib/logger';
import { ValidationError } from '@/services/shared/errors/ValidationError';
import { TextAnalysisNotFoundError } from '@/services/shared/errors/TextAnalysisNotFoundError';
import { DatabaseError } from '@/services/shared/errors/DatabaseError';

export interface RemoveHighlightRequest {
    textAnalysisId: string
    paragraphId: string
    highlightId: string
}

interface RemoveHighlightResponse {
    success: boolean
}

export default async function removeHighlightResolver(_parent: unknown, args: RemoveHighlightRequest, context: any, _info: GraphQLResolveInfo): Promise<RemoveHighlightResponse> {

    try {

        // Map data structure (GraphQL > Mongo) and call business logic
        const response = await removeHighlight(args);

        // Map data structure (Mongo > GraphQL) and return it
        return {
            success: response
        };

    } catch (error) {

        if (error instanceof ValidationError)
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', details: error.message } });
        else if (error instanceof TextAnalysisNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND', details: error.message } });
        else if (error instanceof ParagraphNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'PARAGRAPH_NOT_FOUND', details: error.message } });
        else if (error instanceof HighlightNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'HIGHLIGHT_NOT_FOUND', details: error.message } });
        else if (error instanceof DatabaseError)
            throw new GraphQLError(error.message, { extensions: { code: 'INTERNAL_SERVER_ERROR', details: error.message } });
        else {
            logger.error('remove-highlight-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }

    }

}
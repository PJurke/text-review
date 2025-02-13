import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import removeHighlight from '../business-logic/remove-highlight-logic';

import { TextDocumentNotFoundError } from '@/services/shared/errors/TextDocumentNotFoundError';
import { ParagraphNotFoundError } from '@/services/shared/errors/ParagraphNotFoundError';
import { HighlightNotFoundError } from '@/services/shared/errors/HighlightNotFoundError';
import { ZodError } from 'zod';
import logger from '@/lib/logger';

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

        if (error instanceof TextDocumentNotFoundError) {
            throw new GraphQLError('Text document not found', {
                extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ParagraphNotFoundError) {
            throw new GraphQLError('Paragraph not found', {
                extensions: { code: 'PARAGRAPH_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof HighlightNotFoundError) {
            throw new GraphQLError('Highlight not found', {
                extensions: { code: 'HIGHLIGHT_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ZodError) {
            throw new GraphQLError('Invalid input', {
                extensions: { code: 'INVALID_INPUT', details: error.errors },
            });
        }

        logger.error('Error removing highlight:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
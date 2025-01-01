import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import removeHighlight from '../business-logic/remove-highlight-logic';

import { DocumentNotFoundError } from '@/services/shared/errors/DocumentNotFoundError';
import { HighlightNotFoundError } from '@/services/shared/errors/HighlightNotFoundError';
import { ZodError } from 'zod';

export interface ResolverRequest {
    textDocumentId: string
    highlightId: string
}

interface ResolverResponse {
    success: boolean
    message?: string
}

export default async function removeHighlightResolver(_parent: unknown, args: ResolverRequest, context: any, _info: GraphQLResolveInfo): Promise<ResolverResponse> {

    try {

        // Map data structure (GraphQL > Mongo) and call business logic
        await removeHighlight(args);

        // Map data structure (Mongo > GraphQL) and return it
        return {
            success: true
        };

    } catch (error) {

        if (error instanceof DocumentNotFoundError) {
            throw new GraphQLError('Document not found', {
                extensions: { code: 'DOCUMENT_NOT_FOUND', details: error.message },
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

        console.error('Error removing highlight:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
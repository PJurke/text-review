import { GraphQLResolveInfo } from 'graphql';

import removeHighlight from '../business-logic/remove-highlight-logic';

import { DocumentNotFoundError } from '@/services/shared/errors/DocumentNotFoundError';
import { HighlightNotFoundError } from '@/services/shared/errors/HighlightNotFoundError';

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

        if (error instanceof DocumentNotFoundError || error instanceof HighlightNotFoundError) {
            return {
                success: false,
                message: error.message
            };
        }

        console.error('Error removing highlight:', error);
        return { success: false, message: 'Unknown error' };

    }

}
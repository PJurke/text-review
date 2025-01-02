import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { ZodError } from 'zod';

import Highlight from '@/types/Highlight';
import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError";
import { DocumentNotFoundError } from "@/services/shared/errors/DocumentNotFoundError";
import addHighlight from '../business-logic/add-highlight-logic';
import logger from '@/lib/logger';

export interface ResolverRequest {
    textDocumentId: string;
    paragraphId: string;
    start: number;
    end: number;
}

export default async function addHighlightResolver(_parent: unknown, args: ResolverRequest, context: any, _info: GraphQLResolveInfo): Promise<Highlight> {

    try {

        // Map data structure (GraphQL > Mongo) and call business logic
        const createdHighlight = await addHighlight(args);

        // Map data structure (Mongo > GraphQL) and return it
        return {
            id: createdHighlight.id,
            paragraphId: createdHighlight.paragraphId,
            start: createdHighlight.start,
            end: createdHighlight.end
        };

    } catch (error) {

        if (error instanceof DocumentNotFoundError) {
            throw new GraphQLError('Document not found', {
                extensions: { code: 'DOCUMENT_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ParagraphNotFoundError) {
            throw new GraphQLError('Paragraph not found', {
                extensions: { code: 'PARAGRAPH_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ZodError) {
            throw new GraphQLError('Invalid input', {
                extensions: { code: 'INVALID_INPUT', details: error.errors },
            });
        }

        logger.error('Error adding highlight:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
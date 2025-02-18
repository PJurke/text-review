import { graphql, GraphQLError, GraphQLResolveInfo } from 'graphql';
import { ZodError } from 'zod';

import Highlight from '@/types/Highlight';
import { ParagraphNotFoundError } from "@/services/shared/errors/ParagraphNotFoundError";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import addHighlight from '../business-logic/add-highlight-logic';
import logger from '@/lib/logger';
import { ValidationError } from '@/services/shared/errors/ValidationError';
import { TextAnalysisNotFoundError } from '@/services/shared/errors/TextAnalysisNotFoundError';
import { DatabaseError } from '@/services/shared/errors/DatabaseError';

export interface AddHighlightData {
    textAnalysisId: string;
    paragraphId: string;
    start: number;
    end: number;
}

export default async function addHighlightResolver(_parent: unknown, args: AddHighlightData, context: any, _info: GraphQLResolveInfo): Promise<Highlight> {

    try {

        // Map data structure (GraphQL > Mongo) and call business logic

        const createdHighlight = await addHighlight(args);

        // Map data structure (Mongo > GraphQL) and return it

        return {
            id: createdHighlight.id,
            start: createdHighlight.start,
            end: createdHighlight.end
        };

    } catch(error: unknown) {

        if (error instanceof ValidationError)
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', argumentName: error.field } });
        else if (error instanceof TextAnalysisNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_ANALYSIS_NOT_FOUND' } });
        else if (error instanceof TextDocumentNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND' } });
        else if (error instanceof ParagraphNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'PARAGRAPH_NOT_FOUND' } });
        else if (error instanceof DatabaseError)
            throw new GraphQLError('An internal server error occurred.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        else {
            logger.error('add-highlight-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }

    }

}
import { GraphQLResolveInfo } from 'graphql';
import Highlight from '@/types/Highlight';
import { ParagraphNotFoundError } from "../../shared/errors/ParagraphNotFoundError";
import { DocumentNotFoundError } from "../../shared/errors/DocumentNotFoundError";
import addHighlight from '../business-logic/add-highlight-logic';

export interface ResolverRequest {
    textDocumentId: string;
    paragraphId: string;
    start: number;
    end: number;
}

interface ResolverResponse {
    success: boolean
    message?: string
    highlight?: Highlight
}

export default async function addHighlightResolver(_parent: unknown, args: ResolverRequest, context: any, _info: GraphQLResolveInfo): Promise<ResolverResponse> {

    try {

        // Map data structure (GraphQL > Mongo) and call business logic
        const createdHighlight = await addHighlight(args);

        // Map data structure (Mongo > GraphQL) and return it
        return {
            success: true,
            highlight: {
                id: createdHighlight.id,
                paragraphId: createdHighlight.paragraphId,
                start: createdHighlight.start,
                end: createdHighlight.end
            }
        };

    } catch (error) {

        if (error instanceof DocumentNotFoundError || error instanceof ParagraphNotFoundError) {
            return {
                success: false,
                message: error.message
            };
        }

        console.error('Error adding highlight:', error);
        return { success: false, message: 'Unknown error' };

    }

}
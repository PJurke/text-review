import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { ZodError } from "zod";

import logger from "@/lib/logger";

import getTextDocument from "../business-logic/get-text-document-logic";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import TextDocument from "@/types/TextDocument";

export interface GetTextDocumentData {
    id: string
}

export default async function getTextDocumentResolver(_parent: unknown, args: GetTextDocumentData, context: any, _info: GraphQLResolveInfo): Promise<TextDocument> {

    try {

        const { id } = args
        return await getTextDocument(id)

    } catch (error) {

        if (error instanceof TextDocumentNotFoundError) {
            throw new GraphQLError('Text document not found', {
                extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ZodError) {
            throw new GraphQLError('Invalid input', {
                extensions: { code: 'INVALID_INPUT', details: error.errors },
            });
        }

        logger.error('Error getting text document:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
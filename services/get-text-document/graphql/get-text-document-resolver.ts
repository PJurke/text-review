import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { ZodError } from "zod";

import logger from "@/lib/logger";

import getTextDocument from "../business-logic/get-text-document-logic";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import TextDocument from "@/types/TextDocument";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";

export interface GetTextDocumentData {
    id: string
}

export default async function getTextDocumentResolver(_parent: unknown, args: GetTextDocumentData, context: any, _info: GraphQLResolveInfo): Promise<TextDocument> {

    try {

        const { id } = args
        return await getTextDocument(id)

    } catch (error) {

        if (error instanceof ValidationError)
            throw new GraphQLError(error.message, { extensions: { code: 'BAD_USER_INPUT', details: error.message } });
        else if (error instanceof TextDocumentNotFoundError)
            throw new GraphQLError(error.message, { extensions: { code: 'TEXT_DOCUMENT_NOT_FOUND', details: error.message } });
        else if (error instanceof DatabaseError)
            throw new GraphQLError('An internal server error occurred.', { extensions: { code: 'INTERNAL_SERVER_ERROR', details: error.message } });
        else {
            logger.error('get-text-document-resolver.ts: ', error);
            throw new GraphQLError('An unexpected error occurred', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
        }

    }

}
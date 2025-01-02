import { GraphQLError, GraphQLResolveInfo } from "graphql";
import getDocument from "@/services/get-document/business-logic/get-document-logic";
import TextDocument from "@/types/TextDocument";
import { DocumentNotFoundError } from "@/services/shared/errors/DocumentNotFoundError";
import { ZodError } from "zod";
import logger from "@/lib/logger";

export interface ResolverRequest {
    id: string
}

export default async function getTextDocumentResolver(_parent: unknown, args: ResolverRequest, context: any, _info: GraphQLResolveInfo): Promise<TextDocument> {

    try {

        const { id } = args
        return await getDocument(id)

    } catch (error) {

        if (error instanceof DocumentNotFoundError) {
            throw new GraphQLError('Document not found', {
                extensions: { code: 'DOCUMENT_NOT_FOUND', details: error.message },
            });
        }

        if (error instanceof ZodError) {
            throw new GraphQLError('Invalid input', {
                extensions: { code: 'INVALID_INPUT', details: error.errors },
            });
        }

        logger.error('Error getting document:', error);
        throw new GraphQLError('An unexpected error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });

    }

}
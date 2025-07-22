import { GraphQLResolveInfo } from "graphql";
import logger from "@/lib/logger";

import getTextDocument from "./get-text-document.service";
import { createApiError } from "@/services/shared/graphql/errors";
import { TextDocument } from "@/lib/graphql/generated/graphql";

export type GetTextDocumentArgs = {
    id: string
};

export default async function getTextDocumentResolver(_parent: unknown, args: GetTextDocumentArgs, context: any, _info: GraphQLResolveInfo): Promise<TextDocument> {

    logger.info('getTextDocument: Resolver invoked', { args });

    try {

        const textDocument = await getTextDocument(args.id);

        return {
            id: textDocument.id,
            title: textDocument.title,
            author: textDocument.author,

            paragraphs: textDocument.paragraphs.map((paragraph) => ({
                id: paragraph.id,
                text: paragraph.text
            }))
        };

    } catch (error) {
        throw createApiError(error);
    }

}
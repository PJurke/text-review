import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import { TextDocumentSummary } from "@/types/TextDocumentSummary";

export default async function listTextDocuments(): Promise<TextDocumentSummary[]> {

    try {

        const textDocuments = await prisma.textDocument.findMany({
            select: {
                id: true,
                title: true,
                author: true
            }
        });

        return textDocuments;

    } catch (error) {

        logger.error('list-text-documents-logic.ts:', error);
        throw error;

    }

}
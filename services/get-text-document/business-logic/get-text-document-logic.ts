import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { ValidationError } from "@/services/shared/errors/ValidationError";

export default async function getTextDocument(id: string): Promise<TextDocument> {
    
    // 1. Validate all arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(id);

    if (!validationResult.success)
            throw new ValidationError('Invalid text document id', 'textDocumentId');

    // 2. Database request with Prisma

    try {

        // 3. Retrieve text document including the paragraphs with Prism

        const textDocument = await prisma.textDocument.findUnique({
            where: {
                id: id,
            },
            include: {
                paragraphs: true,
            },
        });

        if (!textDocument) {
            throw new TextDocumentNotFoundError(`Text document with id ${id} not found`);
        }

        return textDocument;

    } catch (error) {

        logger.error('get-text-document-logic.ts:', error);
        throw error;

    }

}
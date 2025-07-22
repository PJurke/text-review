import logger from "@/lib/logger";

import '@/lib/zod/extensions';
import { TextDocument, TextDocumentSchema } from "@/services/text-documents/text-document.model";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { getTextDocumentFromPrisma, TextDocumentWithParagraphs } from "./get-text-document.infrastructure";

export default async function getTextDocument(id: string): Promise<TextDocument> {

    logger.info('getTextDocument: Service invoked', { id });
    
    // 1. Validate all arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(id);

    if (!validationResult.success)
            throw new ValidationError('Invalid text document id', 'textDocumentId');

    // 2. Database request with Prisma
    
    const rawDocument: TextDocumentWithParagraphs | null = await getTextDocumentFromPrisma(id);

    if (!rawDocument)
        throw new TextDocumentNotFoundError(`Text document with id ${id} not found`);
        
    try {

        // 3. Parse to Model

        return TextDocumentSchema.parse(rawDocument);

    } catch (error) {

        logger.error('get-text-document.service.ts', error);
        throw error;

    }

}
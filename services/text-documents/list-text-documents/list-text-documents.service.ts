import logger from "@/lib/logger";

import listTextDocumentsFromPrisma from "./list-text-documents.infrastructure";
import { TextDocumentSummarySchema, TextDocumentSummary } from "@/services/text-documents/text-document-summary.model";

export default async function listTextDocuments(): Promise<TextDocumentSummary[]> {

    // 1. Database request with Prisma

    const rawSummaries = await listTextDocumentsFromPrisma();

    try {

        // 2. Parse to Model

        return TextDocumentSummarySchema.array().parse(rawSummaries);

    } catch (error) {

        logger.error('list-text-documents.service.ts:', error);
        throw error;

    }

}
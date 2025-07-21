import prisma from "@/lib/prisma";
import { TextDocument } from "@prisma/client";

export type TextDocumentSummary = Pick<TextDocument, 'id' | 'title' | 'author'>;

export default async function listTextDocumentsFromPrisma(): Promise<TextDocumentSummary[]> {

    const textDocumentSummaries = await prisma.textDocument.findMany({
        select: {
            id: true,
            title: true,
            author: true
        }
    });

    return textDocumentSummaries;

}
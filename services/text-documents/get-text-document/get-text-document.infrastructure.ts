import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type TextDocumentWithParagraphs = Prisma.TextDocumentGetPayload<{
    include: { paragraphs: true; };
}>;

export async function getTextDocumentFromPrisma(id: string): Promise<TextDocumentWithParagraphs | null> {

    const textDocument = await prisma.textDocument.findUnique({
        where: {
            id: id,
        },
        include: {
            paragraphs: true,
        },
    });

    return textDocument;

}
import { MongoError, ObjectId } from "mongodb";
import logger from "@/lib/logger";
import { getMongoDb } from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import { TextDocumentNotFoundError } from "@/services/shared/errors/TextDocumentNotFoundError";
import { mapTextDocumentEntityToTextDocument } from "@/shared/TextDocumentMapper";
import { ValidationError } from "@/services/shared/errors/ValidationError";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import prisma from "@/lib/prisma";

export default async function getTextDocument(id: string): Promise<TextDocument> {
    
    // 1. Validate all arguments

    const validationResult = TextDocumentSchema.shape.id.safeParse(id);

    if (!validationResult.success)
            throw new ValidationError('Invalid text document id', 'textDocumentId');

    // 2. Database request with Prisma

    const textDocument = await prisma.textDocument.findUnique({
        where: {
            id: id
        },
        include: {
            paragraphs: true
        }
    });

    if (!textDocument)
            throw new TextDocumentNotFoundError(`Text document with id ${id} not found`);

    return textDocument;

}
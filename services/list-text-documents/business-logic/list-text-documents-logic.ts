import { getMongoDb } from "@/app/lib/mongo/mongodb";
import TextDocumentSummaryEntity from "@/entities/TextDocumentSummaryEntity";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { DatabaseError } from "@/services/shared/errors/DatabaseError";
import { mapTextDocumentSummaryEntityToTextDocumentSummary } from "@/shared/TextDocumentSummaryMapper";
import { TextDocumentSummary } from "@/types/TextDocumentSummary";
import { MongoError } from "mongodb";

export default async function listTextDocuments(): Promise<TextDocumentSummary[]> {

    const textDocuments = await prisma.textDocument.findMany({
        select: {
            id: true,
            title: true,
            author: true
        }
    });

    return textDocuments;

}
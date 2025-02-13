import { env, title } from "process";
import { ObjectId } from "mongodb";

import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocumentEntity from "@/entities/TextDocumentEntity";
import { DocumentNotFoundError } from "@/services/shared/errors/DocumentNotFoundError";
import { mapTextDocumentEntityToTextDocument } from "@/shared/TextDocumentMapper";
import logger from "@/lib/logger";
import TextAnalysis, { TextAnalysisSchema } from "@/types/TextAnalysis";
import TextAnalysisEntity from "@/entities/TextAnalysisEntity";
import { TextAnalysisNotFoundError } from "@/services/shared/errors/TextAnalysisNotFoundError";
import ParagraphAnalysisEntity from "@/entities/ParagraphAnalysisEntity";
import Highlight from "@/types/Highlight";
import ParagraphAnalysis from "@/types/ParagraphAnalysis";

function mergeTextAnalysis(textDocumentEntity: TextDocumentEntity, textAnalysisEntity: TextAnalysisEntity): TextAnalysis {

    const paragraphAnalysisMap = new Map<string, ParagraphAnalysisEntity>();

    textAnalysisEntity.paragraphAnalyses.forEach(paragraphAnalysis => {
        paragraphAnalysisMap.set(paragraphAnalysis.paragraphId.toHexString(), paragraphAnalysis)
    });

    const paragraphs: ParagraphAnalysis[] = textDocumentEntity.paragraphs.map(paragraph => {
        const analysisForParagraph = paragraphAnalysisMap.get(paragraph._id.toHexString());

        const highlights: Highlight[] = analysisForParagraph ? analysisForParagraph.highlights.map(h => ({ id: h._id.toString(), start: h.start, end: h.end })) : [];
        
        return {
            id: paragraph._id.toHexString(),
            text: paragraph.text,
            highlights: highlights
        };
    });

    return {
        id: textDocumentEntity._id.toHexString(),
        title: textDocumentEntity.title,
        author: textDocumentEntity.author,
        paragraphs: paragraphs
    };
}

export default async function getTextAnalysis(id: string): Promise<TextAnalysis> {

    // 1. Validate all arguments

    TextAnalysisSchema.shape.id.parse(id)

    // 2. Mapping (GraphQL -> MongoDB)

    const analysisId = new ObjectId(id);

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextAnalysis exists

        const textAnalysis = await db
            .collection<TextAnalysisEntity>('textAnalyses')
            .findOne({ _id: analysisId })

        if (!textAnalysis)
            throw new TextAnalysisNotFoundError(`Text Analysis with id ${id} not found`);

        // 5. Use Text Document Reference to retrieve Text Document

        const textDocument = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne({ _id: textAnalysis.textDocumentId });

        if (!textDocument)
            throw new DocumentNotFoundError(`Text Document with id ${id} not found`);

        // 6. Merge TextAnalysisEntity and TextDocumentEntity into Text Analysis

        const response: TextAnalysis = mergeTextAnalysis(textDocument, textAnalysis);

        // 7. Map Text Document (MongoDB -> GraphQL)

        return response;

    } catch (error) {

        logger.error('Error retrieving document:', error);
        throw error;

    }

}
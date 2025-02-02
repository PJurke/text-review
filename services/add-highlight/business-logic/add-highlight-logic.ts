import { env } from "process"
import { ObjectId, UpdateResult } from "mongodb"
import { z } from "zod"

import clientPromise from "@/app/lib/mongo/mongodb"
import { TextDocumentSchema } from "@/types/TextDocument"
import Highlight, { HighlightSchema } from '@/types/Highlight'

import TextDocumentEntity from "@/services/shared/models/TextDocumentEntity"
import { DocumentNotFoundError } from "../../shared/errors/DocumentNotFoundError"
import HighlightEntity from "@/services/shared/models/HighlightEntity"
import { ParagraphNotFoundError } from "../../shared/errors/ParagraphNotFoundError"
import logger from "@/lib/logger"
import { ParagraphSchema } from "@/types/Paragraph"

interface AddHighlightArgs {
    textDocumentId: string,
    paragraphId: string,
    start: number,
    end: number
}

const AddHighlightArgsSchema = z.object({
    textDocumentId: TextDocumentSchema.shape.id,
    paragraphId: ParagraphSchema.shape.id,
    start: HighlightSchema.shape.start,
    end: HighlightSchema.shape.end
});

export default async function addHighlight(args: AddHighlightArgs): Promise<Highlight> {

    // 1. Validate arguments

    AddHighlightArgsSchema.parse(args);

    // 2. Mapping (GraphQL -> MongoDB)

    const paragraphReference = new ObjectId(args.paragraphId);

    const newHighlight: HighlightEntity = {
        _id: new ObjectId(),
        start: args.start,
        end: args.end
    }

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocumentFilter = {
            _id: new ObjectId(args.textDocumentId),
            "paragraphs._id": new ObjectId(args.paragraphId)
        }
        
        const document = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne(textDocumentFilter);

        if (!document)
            throw new DocumentNotFoundError('The given textDocumentId does not exist');

        // 4. Check if referred ParagraphId exists

        const paragraphExists = document.paragraphs.some(paragraph => paragraph._id.equals(paragraphReference));

        if (!paragraphExists)
            throw new ParagraphNotFoundError('The given paragraphId does not exist');

        // 5. Design update filter
        
        const update = {
            $push: {
                "paragraphs.$.highlights": newHighlight
            }
        }

        // 5. Add new highlight

        const result: UpdateResult = await db.collection<TextDocumentEntity>('textDocuments').updateOne(textDocumentFilter, update)

        // 6. Return the new highlight

        if (result.acknowledged)
            return {
                id: newHighlight._id.toHexString(),
                start: newHighlight.start,
                end: newHighlight.end
            };

        throw new Error('An error occurred while adding a highlight');

    } catch(error) {
        logger.error('An error occurred while adding a highlight:', error);
        throw error;
    }

}
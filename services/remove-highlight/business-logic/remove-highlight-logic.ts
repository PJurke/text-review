import { env } from "process"
import { z } from "zod"
import clientPromise from "@/app/lib/mongo/mongodb"
import { ObjectId, UpdateResult } from "mongodb"

import { HighlightSchema } from '@/types/Highlight'
import TextDocumentEntity from "@/services/shared/models/TextDocumentEntity"
import { DocumentNotFoundError } from "../../shared/errors/DocumentNotFoundError"
import { TextDocumentSchema } from "@/types/TextDocument"
import { HighlightNotFoundError } from "@/services/shared/errors/HighlightNotFoundError"
import logger from "@/lib/logger"
import { ParagraphSchema } from "@/types/Paragraph"

interface RemoveHighlightArgs {
    textDocumentId: string
    paragraphId: string
    highlightId: string
}

interface RemoveHighlightEntity {
    textDocumentId: ObjectId
    paragraphId: ObjectId
    highlightId: ObjectId
}

const RemoveHighlightArgsSchema = z.object({
    textDocumentId: TextDocumentSchema.shape.id,
    paragraphId: ParagraphSchema.shape.id,
    highlightId: HighlightSchema.shape.id
});

export default async function removeHighlight(args: RemoveHighlightArgs): Promise<boolean> {

    // 1. Validate arguments

    RemoveHighlightArgsSchema.parse(args);

    // 2. Map data structure (GraphQL > Mongo)

    const removableHighlight: RemoveHighlightEntity = {
        textDocumentId: new ObjectId(args.textDocumentId),
        paragraphId: new ObjectId(args.paragraphId),
        highlightId: new ObjectId(args.highlightId)
    }

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocumentFilter = { _id: removableHighlight.textDocumentId };
        const document = await db
            .collection<TextDocumentEntity>('textDocuments')
            .findOne(textDocumentFilter);

        if (!document)
            throw new DocumentNotFoundError('The given textDocumentId does not exist');

        // 5. Check if referred Paragraph exists

        const paragraph = document.paragraphs.find((p) =>
            p._id.equals(removableHighlight.paragraphId)
          );

        if (!paragraph)
            throw new Error('The given paragraphId does not exist');

        // 5. Check if referred HighlightId exists

        const highlightExists = paragraph.highlights.some((highlight) =>
            highlight._id.equals(removableHighlight.highlightId)
          );

        if (!highlightExists)
            throw new HighlightNotFoundError('The given highlightId does not exist');

        // 6. Design update filter
        
        const update = {
            $pull: {
                "paragraphs.$[para].highlights": {
                    _id: removableHighlight.highlightId
                }
            }
        }

        const arrayFilters = [{ "para._id": removableHighlight.paragraphId }];

        // 7. Remove highlight

        const result: UpdateResult = await db
            .collection<TextDocumentEntity>('textDocuments')
            .updateOne(textDocumentFilter, update, { arrayFilters });

        if (result.acknowledged)
            return true;

        throw new Error('An error occurred while removing a highlight');

    } catch(error) {
        logger.error('An error occurred while removing a highlight:', error);
        throw error;
    }

}
import clientPromise from "@/app/lib/mongo/mongodb"
import { HighlightSchema } from '@/types/Highlight'
import { ObjectId, UpdateResult } from "mongodb"
import { env } from "process"
import TextDocumentEntity from "@/services/shared/models/TextDocumentEntity"
import { DocumentNotFoundError } from "../../shared/errors/DocumentNotFoundError"
import { ParagraphNotFoundError } from "../../shared/errors/ParagraphNotFoundError"
import { z } from "zod"
import { TextDocumentSchema } from "@/types/TextDocument"
import { ParagraphSchema } from "@/types/Paragraph"
import { HighlightNotFoundError } from "@/services/shared/errors/HighlightNotFoundError"

interface RemoveHighlightArgs {
    textDocumentId: string
    highlightId: string
}

interface RemoveHighlightEntity {
    textDocumentId: ObjectId
    highlightId: ObjectId
}

const RemoveHighlightArgsSchema = z.object({
    textDocumentId: TextDocumentSchema.shape.id,
    highlightId: HighlightSchema.shape.id
});

export default async function removeHighlight(args: RemoveHighlightArgs): Promise<boolean> {

    // 1. Validate arguments

    RemoveHighlightArgsSchema.parse(args);

    // 2. Map data structure (GraphQL > Mongo)

    const removableHighlight: RemoveHighlightEntity = {
        textDocumentId: new ObjectId(args.textDocumentId),
        highlightId: new ObjectId(args.highlightId)
    }

    try {

        // 3. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 4. Check if referred TextDocument exists

        const textDocumentFilter = { _id: removableHighlight.textDocumentId };
        const document = await db
            .collection<TextDocumentEntity>('documents')
            .findOne(textDocumentFilter);

        if (!document)
            throw new DocumentNotFoundError('The given textDocumentId does not exist');

        // 5. Check if referred HighlightId exists

        const highlightExists = document.highlights.some(highlight => highlight._id.equals(removableHighlight.highlightId));

        if (!highlightExists)
            throw new HighlightNotFoundError('The given highlightId does not exist');

        // 6. Design update filter
        
        const update = {
            $pull: {
                highlights: {
                    _id: removableHighlight.highlightId
                }
            }
        }

        // 7. Remove highlight

        const result: UpdateResult = await db.collection<TextDocumentEntity>('documents').updateOne(textDocumentFilter, update)

        if (result.acknowledged)
            return true;

        throw new Error('An error occurred while removing a highlight');

    } catch(error) {
        console.error('An error occurred while removing a highlight:', error);
        throw error;
    }

}
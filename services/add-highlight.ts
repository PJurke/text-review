import { AddHighlightArgs } from "@/app/api/graphql/resolvers"
import clientPromise from "@/app/lib/mongo/mongodb"
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument"
import Highlight, { HighlightSchema } from '@/types/Highlight'
import { ObjectId, UpdateResult } from "mongodb"
import { env } from "process"
import { v4 as uuidv4 } from 'uuid'
import DefaultMutationResponse from "@/app/api/graphql/default-mutation-response"
import { z } from "zod"

const AddHighlightArgsSchema = z.object({
    textDocumentId: TextDocumentSchema.shape.id,
    paragraphId: HighlightSchema.shape.paragraphId,
    start: HighlightSchema.shape.start,
    end: HighlightSchema.shape.end
});

export default async function addHighlight(args: AddHighlightArgs): Promise<DefaultMutationResponse> {

    // 1. Validate arguments

    AddHighlightArgsSchema.parse(args);

    try {

        // 2. Establish database connection

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        // 3. Check if referred TextDocument exists

        const textDocumentFilter = { _id: new ObjectId(args.textDocumentId) };
        const document = await db.collection<TextDocument>('documents').findOne(textDocumentFilter);

        if (!document) {
            return {
                code: 404,
                message: 'The TextDocument has not been found',
                success: false
            }
        }

        // 4. Check if referred ParagraphId exists

        const paragraphExists = document.paragraphs.some(paragraph => paragraph.id === args.paragraphId);

        if (!paragraphExists) {
            return {
                code: 400,
                message: 'The given paragraphId does not exist',
                success: false
            };
        }

        // 5. Create new highlight
        
        const newHighlight: Highlight = {
            id: uuidv4(),
            paragraphId: args.paragraphId,
            start: args.start,
            end: args.end
        }
        const update = {
            $push: {
                highlights: newHighlight
            }
        }

        // 5. Add new highlight

        const result: UpdateResult = await db.collection<TextDocument>('documents').updateOne(textDocumentFilter, update)

        if (result.acknowledged) {
            return {
                code: 200,
                success: true
            }
        }

        return {
            code: 500,
            message: 'The highlight could not be added.',
            success: false
        }

    } catch(error) {
        return {
            code: 500,
            message: 'An unexpected server-error appeared',
            success: false
        }
    }

}
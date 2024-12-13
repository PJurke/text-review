import { AddHighlightArgs } from "@/app/api/graphql/resolvers"
import clientPromise from "@/app/lib/mongo/mongodb"
import TextDocument from "@/types/TextDocument"
import Highlight from '@/types/Highlight'
import { ObjectId, UpdateResult } from "mongodb"
import { env } from "process"
import { v4 as uuidv4 } from 'uuid'

export default async function addHighlight(args: AddHighlightArgs): Promise<Highlight> {

    try {

        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        const filter = { _id: new ObjectId(args.textDocumentId) }
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

        const result: UpdateResult = await db.collection<TextDocument>('documents').updateOne(filter, update)

        return {
            id: '1',
            paragraphId: '2',
            start: 3,
            end: 4
        }

    } catch(error) {
        throw error;
    }

}
import 'server-only';
import { env } from 'node:process'
import clientPromise from '../mongo/mongodb';
import Document from '../Document';
import { ObjectId } from 'mongodb';

export async function getDocument(id: ObjectId): Promise<Document | null> {

    // To do: If the id is not defined or not valid, then throw an exception
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid document ID')
    }

    try {
        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        const document = await db
            .collection<Document>('documents')
            .findOne({ _id: id })

        // To do: Error message in case document has not been found.
        if (!document) {
            console.log(`Document with ID ${id} not found.`)
            return null
        }

        return document

    } catch (error) {

        console.log('Error retrieving document:', error)
        throw error

    }

}
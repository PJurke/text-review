import 'server-only';

import { env } from 'node:process'
import clientPromise from '@/app/lib/mongo/mongodb';
import TextDocument from '@/app/lib/TextDocument';
import { ObjectId } from 'mongodb';

export async function getDocument(id: string): Promise<TextDocument | null> {

    // To do: If the id is not defined or not valid, then throw an exception
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid document ID')
    }

    const oid = new ObjectId(id);

    try {
        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        const document = await db
            .collection<TextDocument>('documents')
            .findOne({ _id: oid })

        // To do: Error message in case document has not been found.
        if (!document) {
            console.log(`Document with ID ${oid} not found.`)
            return null
        }

        // Remove _id by MongoDb
        const { _id, ...plainDocument } = document;
        plainDocument.id = _id.toString();

        return plainDocument;

    } catch (error) {

        console.log('Error retrieving document:', error)
        throw error

    }

}
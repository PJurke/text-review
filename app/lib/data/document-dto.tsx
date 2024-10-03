import 'server-only';

import { env } from 'node:process'
import clientPromise from '../mongo/mongodb';
import Document from '../Document';
import { ObjectId } from 'mongodb';

export async function getDocument(id: ObjectId): Promise<Document | null> {

    try {
        const client = await clientPromise;
        const db = client.db(env.DB_NAME || 'timeline');

        const document = await db
            .collection<Document>('documents')
            .findOne({
                _id: id
            });

        return document;
    } catch (error) {
        console.log(error);
        throw error;
    }

}
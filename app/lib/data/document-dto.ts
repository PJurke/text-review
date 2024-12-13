import 'server-only';

import { env } from 'node:process'
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/app/lib/mongo/mongodb';
import TextDocument, { Highlight } from '@/app/lib/TextDocument';
import { ObjectId } from 'mongodb';
import { DocumentNotFoundError, InvalidDocumentIdError } from './errors';
import { AddHighlightArgs } from '@/app/api/graphql/Resolvers';

export async function getDocument(id: string): Promise<TextDocument> {

    if (!id || !ObjectId.isValid(id))
        throw new InvalidDocumentIdError();

    const oid = new ObjectId(id);

    try {
        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        const document = await db
            .collection<TextDocument>('documents')
            .findOne({ _id: oid })

        if (!document)
            throw new DocumentNotFoundError();

        // Remove _id by MongoDb
        const { _id, ...plainDocument } = document;
        plainDocument.id = _id.toString();

        return plainDocument;

    } catch (error) {

        console.log('Error retrieving document:', error)
        throw error

    }

}

export async function addHighlight(args: AddHighlightArgs): Promise<Highlight> {

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

        const result = await db.collection<TextDocument>('documents').updateOne(filter, update)

    } catch(error) {

    }

    return {
        id: 'abc',
        paragraphId: args.paragraphId,
        start: args.start,
        end: args.end
    };
}
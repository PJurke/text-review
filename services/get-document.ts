import { DocumentNotFoundError, InvalidDocumentIdError } from "@/app/lib/data/errors";
import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocument from "@/types/TextDocument";
import { ObjectId } from "mongodb";
import { env } from "process";

export default async function getDocument(id: string): Promise<TextDocument> {

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
import clientPromise from "@/app/lib/mongo/mongodb";
import TextDocument, { TextDocumentSchema } from "@/types/TextDocument";
import { ObjectId } from "mongodb";
import { env } from "process";

export default async function getDocument(id: string): Promise<TextDocument | null> {

    // 1. Validate arguments

    TextDocumentSchema.shape.id.parse(id)

    // 2. Database operations

    const oid = new ObjectId(id);

    try {
        const client = await clientPromise
        const db = client.db(env.DB_NAME || 'text-review-db')

        const document = await db
            .collection<TextDocument>('documents')
            .findOne({ _id: oid })

        if (!document)
            return null

        // 3. Remove _id by MongoDb

        const { _id, ...plainDocument } = document;
        plainDocument.id = _id.toString();

        return plainDocument;

    } catch (error) {

        console.log('Error retrieving document:', error)
        throw error

    }

}
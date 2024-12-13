import { GraphQLResolveInfo } from "graphql";
import { InternalServerError, InvalidDocumentIdError } from "@/app/lib/data/errors";
import getDocument from "@/services/get-document";
import TextDocument from "@/types/TextDocument";

export interface TextDocumentQueryArgs {
    id: string
}

export default async function TextDocumentQuery(_parent: unknown, args: TextDocumentQueryArgs, context: any, _info: GraphQLResolveInfo) {

    const { id } = args
    let document: TextDocument;

    try {
        document = await getDocument(id);
        return document;
    } catch(error) {
        if (error instanceof InvalidDocumentIdError)
            throw new Error(error.message);
        throw new InternalServerError();
    }

}
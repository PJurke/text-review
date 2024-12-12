import { getDocument } from "@/app/lib/data/document-dto";
import { InternalServerError, InvalidDocumentIdError } from "@/app/lib/data/errors";
import TextDocument from "@/app/lib/TextDocument";
import { GraphQLResolveInfo } from "graphql";

interface TextDocumentArgs {
    id: string
}

export const resolvers = {
    Query: {

        TextDocument: async (_parent: unknown, args: TextDocumentArgs, context: any, _info: GraphQLResolveInfo) => {

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

    }
}
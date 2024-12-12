import { getDocument } from "@/app/lib/data/document-dto";
import { GraphQLResolveInfo } from "graphql";

interface TextDocumentArgs {
    id: string
}

export const resolvers = {
    Query: {

        TextDocument: async (_parent: unknown, args: TextDocumentArgs, context: any, _info: GraphQLResolveInfo) => {

            const { id } = args
            return getDocument(id);

        }

    }
}
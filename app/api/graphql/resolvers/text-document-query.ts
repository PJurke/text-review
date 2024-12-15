import { GraphQLResolveInfo } from "graphql";
import getDocument from "@/services/get-document";

export interface TextDocumentQueryArgs {
    id: string
}

export default async function TextDocumentQuery(_parent: unknown, args: TextDocumentQueryArgs, context: any, _info: GraphQLResolveInfo) {

    const { id } = args
    return getDocument(id)

}
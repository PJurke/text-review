import { GraphQLResolveInfo } from "graphql";
import getDocument from "@/services/get-document/business-logic/get-document-logic";
import TextDocument from "@/types/TextDocument";

export interface ResolverRequest {
    id: string
}

export default async function getTextDocument(_parent: unknown, args: ResolverRequest, context: any, _info: GraphQLResolveInfo): Promise<TextDocument> {

    try {

        const { id } = args
        return await getDocument(id)

    } catch (error) {

        console.error('Error getting document:', error);
        throw error

    }

}
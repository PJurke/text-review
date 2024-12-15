import { GraphQLResolveInfo } from "graphql";
import addHighlight from "@/services/add-highlight";
import DefaultMutationResponse from "../default-mutation-response";

export interface AddHighlightArgs {
    textDocumentId: string
    paragraphId: string
    start: number
    end: number
}

export default async function addHighlightMutation(_parent: unknown, args: AddHighlightArgs, context: any, _info: GraphQLResolveInfo): Promise<DefaultMutationResponse> {
    
    return addHighlight(args);

}
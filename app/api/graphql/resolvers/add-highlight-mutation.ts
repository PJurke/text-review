import { GraphQLResolveInfo } from "graphql";
import Highlight from "@/types/Highlight";
import addHighlight from "@/services/add-highlight";

export interface AddHighlightArgs {
    textDocumentId: string
    paragraphId: string
    start: number
    end: number
}

export default async function addHighlightMutation(_parent: unknown, args: AddHighlightArgs, context: any, _info: GraphQLResolveInfo) {
                
    let result: Highlight;

    try {
        result = await addHighlight(args);
        return result;
    } catch(error) {

    }

}
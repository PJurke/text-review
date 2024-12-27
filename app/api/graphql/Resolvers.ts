import addHighlightResolver from "@/services/add-highlight/graphql/add-highlight-resolver";
import getTextDocument from "@/services/get-document/graphql/get-text-document-resolver";
import removeHighlightResolver from "@/services/remove-highlight/graphql/remove-highlight-resolver";

export const resolvers = {
    Query: {
        TextDocument: getTextDocument
    },
    Mutation: {
        addHighlight: addHighlightResolver,
        removeHighlight: removeHighlightResolver
    }
}
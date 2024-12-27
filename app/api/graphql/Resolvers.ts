import addHighlightResolver from "@/services/add-highlight/graphql/add-highlight-resolver";
import getTextDocumentResolver from "@/services/get-document/graphql/get-text-document-resolver";
import removeHighlightResolver from "@/services/remove-highlight/graphql/remove-highlight-resolver";

export const resolvers = {
    Query: {
        TextDocument: getTextDocumentResolver,
    },
    Mutation: {
        addHighlight: addHighlightResolver,
        removeHighlight: removeHighlightResolver,
    }
}
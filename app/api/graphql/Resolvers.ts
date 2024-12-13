import TextDocumentQuery from "./resolvers/text-document-query";
import addHighlightMutation from "./resolvers/add-highlight-mutation";

export const resolvers = {
    Query: {
        TextDocument: TextDocumentQuery
    },
    Mutation: {
        addHighlight: addHighlightMutation
    }
}

export type { AddHighlightArgs } from './resolvers/add-highlight-mutation'
export type { TextDocumentQueryArgs } from './resolvers/text-document-query'
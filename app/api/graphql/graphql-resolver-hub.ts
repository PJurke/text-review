import { IResolvers } from '@graphql-tools/utils';

import addHighlightResolver from "@/services/add-highlight/graphql/add-highlight-resolver";
import getTextDocumentResolver from "@/services/get-document/graphql/get-text-document-resolver";
import removeHighlightResolver from "@/services/remove-highlight/graphql/remove-highlight-resolver";

export const resolvers: IResolvers = {
    Query: {
        textDocument: getTextDocumentResolver,
    },
    Mutation: {
        addHighlight: addHighlightResolver,
        removeHighlight: removeHighlightResolver,
    }
}
import { IResolvers } from '@graphql-tools/utils';

import getTextAnalysisResolver from '@/services/get-text-analysis/graphql/get-text-analysis-resolver';
import getTextDocumentResolver from '@/services/get-text-document/graphql/get-text-document-resolver';

import createTextAnalysis from '@/services/create-text-analysis/graphql/create-text-analysis-resolver';
import addHighlightResolver from "@/services/add-highlight/graphql/add-highlight-resolver";
import removeHighlightResolver from "@/services/remove-highlight/graphql/remove-highlight-resolver";
import listTextDocumentsResolver from '@/services/list-text-documents/graphql/list-text-documents-resolver';
import loginResolver from '@/services/login/graphql/login-resolver';

export const resolvers: IResolvers = {
    Query: {

        textAnalysis: getTextAnalysisResolver,
        
        textDocument: getTextDocumentResolver,
        textDocuments: listTextDocumentsResolver

    },
    Mutation: {

        addHighlight: addHighlightResolver,
        createTextAnalysis: createTextAnalysis,
        login: loginResolver,
        removeHighlight: removeHighlightResolver

    }
}
import { IResolvers } from '@graphql-tools/utils';

import getTextDocumentResolver from '@/services/text-documents/get-text-document/get-text-document.resolver';
import listTextDocumentsResolver from '@/services/text-documents/list-text-documents/list-text-documents.resolver';

export const resolvers: IResolvers = {
    Query: {
        
        textDocument: getTextDocumentResolver,
        textDocuments: listTextDocumentsResolver

    },
    /*Mutation: {

        

    }*/
}
import { IResolvers } from '@graphql-tools/utils';

import getTextDocumentResolver from '@/services/text-documents/get-text-document/get-text-document.resolver';
import listTextDocumentsResolver from '@/services/text-documents/list-text-documents/list-text-documents.resolver';
import jsonScalar from './json-scalar';

export const resolvers: IResolvers = {
    
    JSON: jsonScalar,

    Query: {
        
        textDocument: getTextDocumentResolver,
        textDocuments: listTextDocumentsResolver

    },
    /*Mutation: {

        

    }*/
}
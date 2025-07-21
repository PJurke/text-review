import { useQuery } from "@apollo/client";
import { LIST_TEXT_DOCUMENTS } from "./list-text-documents.query";

import { TextDocumentsQuery, TextDocumentsQueryVariables } from '@/lib/graphql/generated/graphql';

export const useListTextDocuments = () => {

    const { data, loading, error } = useQuery<TextDocumentsQuery, TextDocumentsQueryVariables>(LIST_TEXT_DOCUMENTS);

    return {
        textDocuments: data?.textDocuments,
        isLoading: loading,
        error
    };

};
import { useQuery } from "@apollo/client";
import { GET_TEXT_DOCUMENT } from "./get-text-document.query";

import { TextDocumentQuery, TextDocumentQueryVariables } from '@/lib/graphql/generated/graphql';

export const useGetTextDocument = (id: string) => {

    const { data, loading, error } = useQuery<TextDocumentQuery, TextDocumentQueryVariables>(GET_TEXT_DOCUMENT, {
        variables: { id: id },
        fetchPolicy: "cache-and-network",
    });

    return {
        textDocument: data?.textDocument,
        isLoading: loading,
        error
    };

};
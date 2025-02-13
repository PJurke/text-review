import { useQuery } from "@apollo/client";
import { GET_TEXT_DOCUMENT } from "./get-text-document-client-request";
import TextDocument from "@/types/TextDocument";

interface GetTextDocumentData {
    textDocument: TextDocument;
}

const useTextDocument = (textDocumentId: string) => {

    const { data, loading, error } = useQuery<GetTextDocumentData>(GET_TEXT_DOCUMENT, {
        variables: { id: textDocumentId },
        fetchPolicy: "cache-and-network",
    });

    return {
        textDocument: data?.textDocument || null,
        loading,
        error
    };

};

export default useTextDocument;
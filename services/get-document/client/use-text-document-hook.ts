import { useQuery } from "@apollo/client";
import { GET_TEXT_DOCUMENT } from "@/services/get-document/client/get-text-document-client-request";
import TextDocument from "@/types/TextDocument";

interface GetTextDocumentData {
    TextDocument: TextDocument;
}

const useTextDocument = (textDocumentId: string) => {

    const { data, loading, error } = useQuery<GetTextDocumentData>(GET_TEXT_DOCUMENT, {
        variables: { textDocumentId },
        fetchPolicy: "cache-and-network",
    });

    return {
        textDocument: data?.TextDocument || null,
        loading,
        error
    };

};

export default useTextDocument;
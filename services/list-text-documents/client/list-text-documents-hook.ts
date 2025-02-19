import { useQuery } from "@apollo/client";
import { LIST_TEXT_DOCUMENTS } from "./list-text-documents-client-request";
import TextDocumentSummary from "@/types/TextDocument";

interface ListTextDocumentsData {
    textDocumentSummaries: TextDocumentSummary[];
}

const useListTextDocuments = () => {

    const { data, loading, error } = useQuery<ListTextDocumentsData>(LIST_TEXT_DOCUMENTS);

    return {
        textDocuments: data?.textDocumentSummaries,
        loading,
        error
    };

};

export default useListTextDocuments;
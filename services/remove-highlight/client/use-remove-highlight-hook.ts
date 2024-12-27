import { useMutation } from "@apollo/client";
import { REMOVE_HIGHLIGHT } from "./remove-highlight-client-request";
import { GET_TEXT_DOCUMENT } from "../../get-document/client/get-text-document-client-request";

export interface RemoveHighlightVariables {
    textDocumentId: string;
    highlightId: string;
}

interface RemoveHighlightResponse {
    success: boolean;
}

const useRemoveHighlight = () => {

    const [removeHighlight, { data, loading, error }] = useMutation<RemoveHighlightResponse, RemoveHighlightVariables>(REMOVE_HIGHLIGHT, {
        refetchQueries: [ GET_TEXT_DOCUMENT, 'TextDocument' ]
    });

    return {
        removeHighlight,
        data,
        loading,
        error
    };

};

export default useRemoveHighlight;
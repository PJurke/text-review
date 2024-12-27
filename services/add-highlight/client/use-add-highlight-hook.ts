import { useMutation } from "@apollo/client";
import { ADD_HIGHLIGHT } from "./add-highlight-client-request";
import Highlight from "@/types/Highlight";
import { GET_TEXT_DOCUMENT } from "../../get-document/client/get-text-document-client-request";

export interface AddHighlightVariables {
    textDocumentId: string;
    paragraphId: string;
    start: number;
    end: number;
}

interface AddHighlightResponse {
    highlight: Highlight;
}

const useAddHighlight = () => {

    const [addHighlight, { data, loading, error }] = useMutation<AddHighlightResponse, AddHighlightVariables>(ADD_HIGHLIGHT, {
        refetchQueries: [ GET_TEXT_DOCUMENT, 'TextDocument' ]
    });

    return {
        addHighlight,
        highlight: data?.highlight || null,
        loading,
        error
    };

};

export default useAddHighlight;
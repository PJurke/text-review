import { useMutation } from "@apollo/client";
import { ADD_HIGHLIGHT } from "./add-highlight-client-request";
import Highlight from "@/types/Highlight";
import { GET_TEXT_DOCUMENT } from "../../get-document/client/get-text-document-client-request";

interface AddHighlightData {
    highlight: Highlight;
}

const useAddHighlight = () => {

    const [addHighlight, { data, loading, error }] = useMutation<AddHighlightData>(ADD_HIGHLIGHT, {
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
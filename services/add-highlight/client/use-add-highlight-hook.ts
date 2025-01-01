import { gql, useMutation } from "@apollo/client";

import { ADD_HIGHLIGHT } from "./add-highlight-client-request";
import Highlight from "@/types/Highlight";

export interface AddHighlightVariables {
    textDocumentId: string;
    paragraphId: string;
    start: number;
    end: number;
}

export interface AddHighlightResponse {
    addHighlight: Highlight;
}

const useAddHighlight = () => {

    const [addHighlight, { data, loading, error }] = useMutation<AddHighlightResponse, AddHighlightVariables>(ADD_HIGHLIGHT, {

        update(cache, { data }, { variables }) {
            
            if (!data) return;
            
            const newHighlight = data.addHighlight;
            const textDocumentId = variables?.textDocumentId;
            if (!textDocumentId) return;

            const textDocumentCacheId = cache.identify({ __typename: 'TextDocument', id: textDocumentId });
            if (!textDocumentCacheId) return;

            cache.modify({
                id: textDocumentCacheId,
                fields: {
                    highlights(existingHighlights = []) {
                        const newHighlightRef = cache.writeFragment({
                            data: newHighlight,
                            fragment: gql`
                                fragment NewHighlight on Highlight {
                                    id
                                    paragraphId
                                    start
                                    end
                                    __typename
                                }
                            `
                        });
                        return [...existingHighlights, newHighlightRef];
                    }
                }
            });

        }

    });

    return {
        addHighlight,
        highlight: data,
        loading,
        error
    };

};

export default useAddHighlight;
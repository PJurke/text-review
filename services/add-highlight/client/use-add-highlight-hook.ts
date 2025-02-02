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
            const paragraphId = variables?.paragraphId;
            if (!paragraphId) return;

            const paragraphCacheId = cache.identify({ __typename: 'Paragraph', id: paragraphId });
            if (!paragraphCacheId) return;

            cache.modify({
                id: paragraphCacheId,
                fields: {
                    highlights(existingHighlights = []) {
                        const newHighlightRef = cache.writeFragment({
                            data: newHighlight,
                            fragment: gql`
                                fragment NewHighlight on Highlight {
                                    id
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
        highlight: data?.addHighlight || null,
        loading,
        error
    };

};

export default useAddHighlight;
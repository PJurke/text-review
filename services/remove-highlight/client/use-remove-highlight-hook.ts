import { ApolloCache, Reference, useMutation } from "@apollo/client";
import { REMOVE_HIGHLIGHT } from "./remove-highlight-client-request";

export interface RemoveHighlightVariables {
    textDocumentId: string;
    highlightId: string;
}

export interface RemoveHighlightResponse {
    removeHighlight: {
        success: boolean;
        __typename: string;
    }
}

const useRemoveHighlight = () => {

    const [removeHighlight, { data, loading, error }] = useMutation<RemoveHighlightResponse, RemoveHighlightVariables>(REMOVE_HIGHLIGHT, {

        update(cache: ApolloCache<RemoveHighlightResponse>, { data, errors }, { variables }) {

            if (!data?.removeHighlight?.success || errors) {
                console.error("Remove highlight error:", errors);
                return;
            }

            const { textDocumentId, highlightId } = variables || {};
            if (!textDocumentId || !highlightId) {
                console.error("Invalid mutation variables:", variables);
                return;
            }

            const textDocumentCacheId = cache.identify({ __typename: 'TextDocument', id: textDocumentId });
            if (!textDocumentCacheId) {
                console.error("Cache identification not possible:", textDocumentId);
                return;
            }

            cache.modify({
                id: textDocumentCacheId,
                fields: {
                    highlights(existingHighlights: readonly Reference[] = [], { readField }) {
                        return existingHighlights.filter(
                            (highlightRef) => readField('id', highlightRef) !== highlightId
                        );
                    }
                }
            });

        }

    });

    return {
        removeHighlight,
        data,
        loading,
        error
    };

};

export default useRemoveHighlight;
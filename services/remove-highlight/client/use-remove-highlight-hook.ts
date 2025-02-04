import { ApolloCache, Reference, useMutation } from "@apollo/client";
import { REMOVE_HIGHLIGHT } from "./remove-highlight-client-request";

// Types

export interface RemoveHighlightVariables {
    textDocumentId: string;
    paragraphId: string;
    highlightId: string;
}

export interface RemoveHighlightResponse {
    removeHighlight: {
        success: boolean;
        __typename: string;
    }
}

interface RemoveHighlightResult {
    success: boolean;
    errorMessage?: string;
}

export interface UseRemoveHighlightReturn {
    removeHighlight: (variables: RemoveHighlightVariables) => Promise<RemoveHighlightResult>;
}

// Helper Functions

/**
 * Updates the Apollo Cache after successful removal of a highlight.
 * @param cache The ApolloCache.
 * @param variables The variables which have been used for the mutation.
 */
function updateCacheAfterRemove(cache: ApolloCache<RemoveHighlightResponse>, variables: RemoveHighlightVariables): void {

    const { textDocumentId, paragraphId, highlightId } = variables;
    if (!textDocumentId || !paragraphId || !highlightId) {
        console.error("Invalid mutation variables:", variables);
        return;
    }

    const paragraphCacheId = cache.identify({ __typename: 'Paragraph', id: paragraphId });
    if (!paragraphCacheId) {
        console.error("Cache identification not possible for textDocumentId:", textDocumentId);
        return;
    }

    cache.modify({
        id: paragraphCacheId,
        fields: {
            highlights(existingHighlights: readonly Reference[] = [], { readField }) {
                return existingHighlights.filter(
                    (highlightRef) => readField('id', highlightRef) !== highlightId
                );
            }
        }
    });

}

// Hook

export default function useRemoveHighlight(): UseRemoveHighlightReturn {

    const [removeHighlightMutation] = useMutation<RemoveHighlightResponse, RemoveHighlightVariables>(REMOVE_HIGHLIGHT, {
        update(cache, { data, errors }, { variables }) {
            
            if (errors) {
                console.error("GraphQL-error during removeHighlight mutation:", errors);
                return;
            }      

            if (!data?.removeHighlight?.success) {
                console.error("removeHighlight mutation failed:", errors);
                return;
            }

            if (variables) {
                updateCacheAfterRemove(cache, variables);
            }
        }
    });

    const removeHighlight = async (variables: RemoveHighlightVariables): Promise<RemoveHighlightResult> => {
        try {
            const { data } = await removeHighlightMutation({
                variables,
                optimisticResponse: {
                    removeHighlight: {
                        success: true,
                        __typename: 'RemoveHighlightResponse'
                    }
                }
            });

            if (data?.removeHighlight?.success) {
                return { success: true };
            }

            return {
                success: false,
                errorMessage: "The removal of the highlight was not successfully.",
            };
        } catch (error) {
            console.error("Error during the removeHighlight mutation:", error);
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : String(error)
            };
        }
    };

    return { removeHighlight };

}
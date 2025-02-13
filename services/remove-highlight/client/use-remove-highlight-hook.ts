import { ApolloCache, Reference, useMutation } from "@apollo/client";
import { REMOVE_HIGHLIGHT } from "./remove-highlight-client-request";

// Type definitions for variables and response

export interface RemoveHighlightVariables {
    textAnalysisId: string;
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
    error?: Error;
}

export interface UseRemoveHighlightReturn {
    removeHighlight: (variables: RemoveHighlightVariables) => Promise<RemoveHighlightResult>;
}

// Helper Functions

/**
 * Updates the Apollo Cache after successfully removing a highlight.
 * @param cache The ApolloCache
 * @param variables The variables for the mutation
 */
function updateCacheAfterRemove(cache: ApolloCache<RemoveHighlightResponse>, variables: RemoveHighlightVariables): void {

    const { textAnalysisId, paragraphId, highlightId } = variables;

    // Validation of the variables
    if (!textAnalysisId || !paragraphId || !highlightId) {
        console.error("Invalid mutation variables:", variables);
        return;
    }

    // Identify the cache entry for the corresponding paragraph object
    const paragraphCacheId = cache.identify({ __typename: 'ParagraphAnalysis', id: paragraphId });
    if (!paragraphCacheId) {
        console.error("Cache identification not possible for textAnalysisId:", textAnalysisId);
        return;
    }

    // Remove the highlight from the cache using the ID
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

/**
 * Custom hook for removing a highlight.
 */
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

    /**
     * Executes the mutation to remove a highlight.
     *
     * @param variables - The variables for the mutation
     * @returns A Promise with the result of the mutation
     */
    const removeHighlight = async (variables: RemoveHighlightVariables): Promise<RemoveHighlightResult> => {
        try {
            const { data, errors } = await removeHighlightMutation({
                variables,
                optimisticResponse: {
                    removeHighlight: {
                        success: true,
                        __typename: 'RemoveHighlightResponse'
                    }
                }
            });

            if (errors) {
                return {
                    success: false,
                    error: new Error(errors[0].message)
                }
            }

            if (data?.removeHighlight?.success) {
                return { success: true };
            }

            return { success: false, error: new Error('Unknown error') };
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error during the removeHighlight mutation:", errorMessage);
            return { success: false, error: new Error(errorMessage) };
        }
    };

    return { removeHighlight };

}
import { ApolloCache, gql, useMutation } from "@apollo/client";
import { ADD_HIGHLIGHT } from "./add-highlight-client-request";
import Highlight from "@/types/Highlight";

// GraphQL fragment for displaying a new highlight
const NEW_HIGHLIGHT_FRAGMENT = gql`
    fragment NewHighlight on Highlight {
        id
        start
        end
        __typename
    }
`;

// Type definitions for the variables and response of the mutation

export interface AddHighlightVariables {
    textAnalysisId: string;
    paragraphId: string;
    start: number;
    end: number;
}

export interface AddHighlightResponse {
    addHighlight: Highlight;
}

interface AddHighlightResult {
    highlight?: Highlight;
    success: boolean;
    error?: Error;
}

export interface UseAddHighlightReturn {
    addHighlight: (variables: AddHighlightVariables) => Promise<AddHighlightResult>;
}

/**
 * Updates the cache after a successful AddHighlight mutation.
 *
 * @param cache - The ApolloCache
 * @param variables - The variables for the mutation
 * @param newHighlight - The newly created highlight
 */
function updateCacheAfterAdd(cache: ApolloCache<AddHighlightResponse>, variables: AddHighlightVariables, newHighlight: Highlight): void {

    // Identify the cache entry for the corresponding paragraph object
    const paragraphCacheId = cache.identify({ __typename: 'Paragraph', id: variables.paragraphId });
    if (!paragraphCacheId) {
        console.error("Cache identification not possible for paragraphId:", variables.paragraphId);
        return;
    }

    // Add the new highlight to the array of highlights
    cache.modify({
        id: paragraphCacheId,
        fields: {
            highlights(existingHighlights: readonly any[] = []) {

                // Write the new highlight as a fragment in the cache
                const newHighlightRef = cache.writeFragment({
                    data: newHighlight,
                    fragment: NEW_HIGHLIGHT_FRAGMENT
                });

                return [...existingHighlights, newHighlightRef];

            }
        }
    });

}

/**
 * Custom hook for adding a highlight.
 */
export default function useAddHighlight(): UseAddHighlightReturn {

    const [addHighlightMutation] = useMutation<AddHighlightResponse, AddHighlightVariables>(ADD_HIGHLIGHT, {
        update(cache, { data }, { variables }) {

            if (!data || !variables) return;

            updateCacheAfterAdd(cache, variables, data.addHighlight);
        }
    });

    /**
     * Performs the mutation to add a highlight.
     *
     * @param variables - The variables for the mutation
     * @returns A Promise with the result of the mutation
     */
    const addHighlight = async (variables: AddHighlightVariables): Promise<AddHighlightResult> => {
        try {
            const { data, errors } = await addHighlightMutation({
                variables,
                optimisticResponse: {
                    addHighlight: {
                        id: "temp-id", // Provisional Id for optimistic UI
                        start: variables.start,
                        end: variables.end,
                        __typename: "Highlight",
                    }
                }
            });

            if (errors) {
                return {
                    success: false,
                    error: new Error(errors[0].message)
                }
            }
    
            if (data && data.addHighlight)
                return { highlight: data.addHighlight, success: true };

            return { success: false, error: new Error('Unknown error') };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error during the addHighlight mutation:", errorMessage);
            return { success: false, error: new Error(errorMessage) };
        }
    };
    
    return { addHighlight };
    
}
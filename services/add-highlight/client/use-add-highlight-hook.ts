import { ApolloCache, gql, Reference, useMutation } from "@apollo/client";
import { ADD_HIGHLIGHT } from "./add-highlight-client-request";
import Highlight from "@/types/Highlight";

// Types

const NEW_HIGHLIGHT_FRAGMENT = gql`
    fragment NewHighlight on Highlight {
        id
        start
        end
        __typename
    }
`;

export interface AddHighlightVariables {
    textDocumentId: string;
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
}

export interface UseAddHighlightReturn {
    addHighlight: (variables: AddHighlightVariables) => Promise<AddHighlightResult>;
}

function updateCacheAfterAdd(cache: ApolloCache<AddHighlightResponse>, variables: AddHighlightVariables, newHighlight: Highlight): void {

    const paragraphCacheId = cache.identify({ __typename: 'Paragraph', id: variables.paragraphId });
    if (!paragraphCacheId) {
        console.error("Cache identification not possible for paragraphId:", variables.paragraphId);
        return;
    }

    cache.modify({
        id: paragraphCacheId,
        fields: {
            highlights(existingHighlights: readonly any[] = []) {
                const newHighlightRef = cache.writeFragment({
                    data: newHighlight,
                    fragment: NEW_HIGHLIGHT_FRAGMENT
                });
                return [...existingHighlights, newHighlightRef];
            }
        }
    });

}

export default function useAddHighlight(): UseAddHighlightReturn {

    const [addHighlightMutation] = useMutation<AddHighlightResponse, AddHighlightVariables>(ADD_HIGHLIGHT, {
        update(cache, { data }, { variables }) {

            if (!data || !variables) return;

            updateCacheAfterAdd(cache, variables, data.addHighlight);
        }
    });

    const addHighlight = async (variables: AddHighlightVariables): Promise<AddHighlightResult> => {
        try {
            const { data } = await addHighlightMutation({
                variables,
                optimisticResponse: {
                    addHighlight: {
                        id: "temp-id", // Provisorische ID für das optimistic UI
                        start: variables.start,
                        end: variables.end,
                        __typename: "Highlight",
                    }
                }
            });
    
        if (data && data.addHighlight) {
            return { highlight: data.addHighlight, success: true };
        }
    
        return { success: false };

        } catch (error) {
            console.error("Error during the addHighlight mutation:", error);
            return { success: false };
        }
    };
    
    return { addHighlight };

}
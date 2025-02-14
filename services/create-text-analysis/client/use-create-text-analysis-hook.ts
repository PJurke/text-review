import { ApolloCache, gql, useMutation } from "@apollo/client";
import { CREATE_TEXT_ANALYSIS } from "./create-text-analysis-request";

// Type definitions for the variables and response of the mutation

export interface CreateTextAnalysisVariables {
    textDocumentId: string;
}

export interface CreateTextAnalysisResponse {
    textAnalysisId: string;
}

interface CreateTextAnalysisResult {
    textAnalysisId?: string;
    error?: Error;
}

export interface UseCreateTextAnalysisReturn {
    createTextAnalysis: (variables: CreateTextAnalysisVariables) => Promise<CreateTextAnalysisResult>;
    loading: boolean;
}

/**
 * Custom hook for adding a highlight.
 */
export default function useCreateTextAnalysis(): UseCreateTextAnalysisReturn {

    const [ createTextAnalysisMutation, { loading } ] = useMutation<CreateTextAnalysisResponse, CreateTextAnalysisVariables>(CREATE_TEXT_ANALYSIS);

    /**
     * Performs the mutation to create a new text analysis.
     *
     * @param variables - The variables for the mutation
     * @returns A Promise with the result of the mutation
     */
    const createTextAnalysis = async (variables: CreateTextAnalysisVariables): Promise<CreateTextAnalysisResult> => {
        try {
            const { data, errors } = await createTextAnalysisMutation({ variables });

            if (errors) {
                return {
                    error: new Error(errors[0].message)
                }
            }
    
            if (data && data.textAnalysisId)
                return { textAnalysisId: data.textAnalysisId };

            return { error: new Error('Unknown error') };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error during the create text analysis mutation:", errorMessage);
            return { error: new Error(errorMessage) };
        }
    };
    
    return { createTextAnalysis, loading };
    
}
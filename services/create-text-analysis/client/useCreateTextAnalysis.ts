import { useMutation } from "@apollo/client";
import { CREATE_TEXT_ANALYSIS } from "./create-text-analysis-request";

// Type definitions for the variables and response of the mutation

export interface CreateTextAnalysisVariables {
    textDocumentId: string;
}

export interface CreateTextAnalysisResponse {
    createTextAnalysis: {
        id: string;
    }
}

export interface UseCreateTextAnalysisReturn {
    createTextAnalysis: (variables: CreateTextAnalysisVariables) => Promise<string>;
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
     * @param variables - The variables for the mutation.
     * @returns A promise with the id of the newly created text analysis.
     */
    const createTextAnalysis = async (variables: CreateTextAnalysisVariables): Promise<string> => {
        const { data, errors } = await createTextAnalysisMutation({ variables });

        if (errors)
            throw new Error(errors[0].message);

        if (data && data.createTextAnalysis)
            return data.createTextAnalysis.id;

        throw new Error('Unknown error');
    };
    
    return { createTextAnalysis, loading };
    
}
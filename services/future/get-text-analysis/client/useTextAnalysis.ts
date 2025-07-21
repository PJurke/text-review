import { useQuery } from "@apollo/client";
import { GET_TEXT_ANALYSIS } from "./get-text-analysis-client-request";
import TextAnalysis from "@/types/TextAnalysis";

interface GetTextAnalysisData {
    textAnalysis: TextAnalysis;
}

const useTextAnalysis = (textAnalysisId: string) => {

    const { data, loading, error } = useQuery<GetTextAnalysisData>(GET_TEXT_ANALYSIS, {
        variables: { id: textAnalysisId },
        fetchPolicy: "cache-and-network",
    });

    return {
        textAnalysis: data?.textAnalysis || null,
        loading,
        error
    };

};

export default useTextAnalysis;
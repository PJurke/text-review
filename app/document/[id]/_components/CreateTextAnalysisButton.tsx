import { useErrorOverlay } from "@/components/ErrorOverlay/error-overlay-context";
import useCreateTextAnalysis from "@/services/create-text-analysis/client/use-create-text-analysis-hook";
import { redirect } from "next/navigation";

interface CreateTextAnalysisProps {
    id: string;
}

export default function CreateTextAnalysisButton({ id }: CreateTextAnalysisProps): JSX.Element {

    const { createTextAnalysis, loading } = useCreateTextAnalysis();
    const { showError } = useErrorOverlay();

    // 2. Handle Create Text Analysis Click

    const createTextAnalysisHandler = async () => {
        try {
            const textAnalysisId = await createTextAnalysis({ textDocumentId: id });
            redirect(`/analysis/${textAnalysisId}`);
        } catch(error) {
            showError({
                title: 'An error appeared!',
                message: ''
            })
        }
    };

    return (
        <button onClick={createTextAnalysisHandler} className='cursor-pointer hover:underline'>Create Text Analysis</button>
    );

}
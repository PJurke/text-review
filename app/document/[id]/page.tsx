'use client';

import { redirect, useParams } from 'next/navigation';
import TextDocumentComponent from './_components/TextDocumentComponent';
import useCreateTextAnalysis from '@/services/create-text-analysis/client/use-create-text-analysis-hook';

export default function Page(): JSX.Element {

    const { createTextAnalysis, loading } = useCreateTextAnalysis();

    // 1. Extract id from url
    
    const { id } = useParams<{ id: string }>();

    // 2. Handle Create Text Analysis Click

    const createTextAnalysisHandler = async () => {
        const textAnalysisId = await createTextAnalysis({ textDocumentId: id });
        redirect(`/analysis/${textAnalysisId}`);
    };

    // 3. Render TextDocument component

    return (
        <>
            <button onClick={createTextAnalysisHandler}>Create Text Analysis</button>
            <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
                <TextDocumentComponent id={id} />
            </section>
        </>
    );
}
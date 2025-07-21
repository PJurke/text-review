'use client';

import useTextAnalysis from "@/services/get-text-analysis/client/useTextAnalysis";
import { TextAnalysisSchema } from "@/types/TextAnalysis";

import ParagraphAnalysisComponent from "./ParagraphAnalysisComponent";
import TextAnalysisRetrievalErrorMessage from "./TextAnalysisRetrievalErrorMessage";
import InvalidIdMessage from "./InvalidIdMessage";
import TextAnalysisNotFoundMessage from "./TextAnalysisNotFoundMessage";
import LoadingSkeleton from "./LoadingSkeleton";

interface TextAnalysisComponentProps {
    id: string;
}

export default function TextAnalysisComponent({ id }: TextAnalysisComponentProps): JSX.Element {

    // 1. Validate text analysis id

    const parseResult = TextAnalysisSchema.shape.id.safeParse(id);

    // 2. Use text analysis and add highlight hooks

    const { textAnalysis, loading, error } = useTextAnalysis(
        parseResult.success ? id : ''
    );

    // 3. Check parameters

    if (parseResult.error) return <InvalidIdMessage />
    if (loading) return <LoadingSkeleton />
    if (error) return <TextAnalysisRetrievalErrorMessage />
    if (!textAnalysis) return <TextAnalysisNotFoundMessage />

    // 4. Render

    return (
        <div>

            <h1 className="text-3xl">{textAnalysis.title}</h1>
            <div className="text-neutral-500">by {textAnalysis.author}</div>

            {textAnalysis.paragraphs.map(paragraph => (
                <ParagraphAnalysisComponent
                    key={paragraph.id}
                    textAnalysisId={id}
                    paragraphAnalysis={paragraph}
                />
            ))}

        </div>
    );
}
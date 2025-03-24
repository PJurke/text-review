'use client';

// Import React

import React, { useCallback, useMemo, useRef, useState } from "react";

// Import Hooks

import useAddHighlight from "@/services/add-highlight/client/use-add-highlight-hook";
import useRemoveHighlight from "@/services/remove-highlight/client/use-remove-highlight-hook";

// Import Types

import ParagraphAnalysis from "@/types/ParagraphAnalysis";

// Import Utils

import { getSelectionIndices } from "../_utils/selectionIndices";
import segmentParagraph, { Segment } from "../_utils/segmentParagraph";
import { useErrorOverlay } from "@/components/ErrorOverlay/error-overlay-context";

interface ParagraphAnalysisProps {
    textAnalysisId: string;
    paragraphAnalysis: ParagraphAnalysis;
}

function ParagraphAnalysisComponent({ textAnalysisId, paragraphAnalysis }: ParagraphAnalysisProps): JSX.Element {

    const { setErrorData } = useErrorOverlay();
    const paragraphRef = useRef<HTMLParagraphElement>(null); // Reference to paragraph - used for correct mouse highlighting location
    const { addHighlight } = useAddHighlight();
    const { removeHighlight } = useRemoveHighlight();
    
    const { id: paragraphId, text, highlights } = paragraphAnalysis;

    // Currently active highlight (ID = string)

    const [activeHighlight, setActiveHighlight] = useState<string>('');
    
    // Segmenting mechanism for working active highlighting

    const segments: Segment[] = useMemo(() => segmentParagraph(text, highlights), [highlights, text])

    const handleMouseEnter = useCallback((segment: Segment) => {
        // Set the first existing highlight ID as active when the segment is hovered
        if (segment.highlightIds.length > 0)
            setActiveHighlight(segment.highlightIds[0]);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setActiveHighlight('');
    }, []);

    const handleRemoveHighlight = useCallback(async (highlightId: string) => {

        const removeResult = await removeHighlight({
            textAnalysisId: textAnalysisId,
            paragraphId: paragraphId,
            highlightId: highlightId
        });

        if (!removeResult.success) {
            switch (removeResult.error?.message) {
                case 'Document not found':
                case 'Paragraph not found':
                case 'Highlight not found':
                case 'Invalid input':
                case 'An unexpected error occurred':
                default: {
                    setErrorData({
                        title: 'Something went wrong',
                        message: 'Our system encountered an error.',
                        action: {
                            label: 'Please refresh the page',
                            onAction: () => window.location.reload()
                        }
                    });
                }
            }
            setActiveHighlight('');
        }
        
    }, [ textAnalysisId, paragraphId, removeHighlight ]);

    const handleClick = useCallback((segment: Segment) => {
        if (activeHighlight && segment.highlightIds.includes(activeHighlight))
            handleRemoveHighlight(activeHighlight);
    }, [activeHighlight, handleRemoveHighlight]);

    const handleMouseUp = useCallback(async () => {
        
        if (!paragraphRef.current)
            return;

        const indices = getSelectionIndices(paragraphRef);
        if (!indices || indices.start === indices.end)
            return;

        const addResult = await addHighlight({
            textAnalysisId: textAnalysisId,
            paragraphId: paragraphId,
            start: indices.start,
            end: indices.end
        });

        if (!addResult.success) {
            switch (addResult.error?.message) {
                case 'Document not found':
                case 'Paragraph not found':
                case 'Invalid input':
                case 'An unexpected error occurred':
                default: {
                    setErrorData({
                        title: 'Something went wrong',
                        message: 'Our system encountered an error.',
                        action: {
                            label: 'Please refresh the page',
                            onAction: () => window.location.reload()
                        }
                    });
                }
            }
            window.getSelection()?.removeAllRanges();
        }

    }, [textAnalysisId, paragraphId, addHighlight]);

    // Render

    return (

        <p ref={paragraphRef} onMouseUp={handleMouseUp} className="leading-9 mt-8 text-lg">
            {segments.map((segment, index) => {

                if (segment.highlightIds.length === 0)
                    return <React.Fragment key={index}>{segment.text}</React.Fragment>;

                // Determine if the current segment is part of the active highlight
                const isActive = segment.highlightIds.includes(activeHighlight);

                // Create a unique key for the `mark` element
                const markKey = `${index}-${segment.highlightIds.join('-')}`;

                return (
                    <mark
                        key={markKey}
                        className={`${isActive ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter(segment)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(segment)}
                    >
                        {segment.text}
                    </mark>
                );
            })}
        </p>

    );
}

export default React.memo(ParagraphAnalysisComponent);
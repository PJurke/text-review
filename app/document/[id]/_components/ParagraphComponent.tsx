'use client';

// Import React
import React, { useCallback, useMemo, useRef, useState } from "react";

// Import Hooks
import useAddHighlight from "@/services/add-highlight/client/use-add-highlight-hook";
import useRemoveHighlight from "@/services/remove-highlight/client/use-remove-highlight-hook";

// Import Types
import Paragraph from "@/types/Paragraph";
import Highlight from "@/types/Highlight";

// Import Utils
import { getSelectionIndices } from "../_utils/selectionIndices";
import segmentParagraph, { Segment } from "../_utils/segmentParagraph";
import { useAddHighlightError, useRemoveHighlightError } from "../_hooks/useHandleClientError";

interface ParagraphProps {
    documentId: string;
    paragraph: Paragraph;
}

export default function ParagraphComponent({ documentId, paragraph }: ParagraphProps): JSX.Element {

    // Reference to paragraph - used for correct mouse highlighting location

    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;

    const { addHighlight } = useAddHighlight();
    const { removeHighlight } = useRemoveHighlight();

    // Currently active highlight (ID = string)

    const [activeHighlight, setActiveHighlight] = useState<string>('');
    
    // Segmenting mechanism for working active highlighting

    const segments: Segment[] = useMemo(() => {
        return segmentParagraph(text, paragraph.highlights);
    }, [text, paragraph.highlights]);

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
            textDocumentId: documentId,
            paragraphId: paragraph.id,
            highlightId: highlightId
        });

        if (!removeResult.success)
            setActiveHighlight('');
        
    }, [ documentId, paragraph.id, removeHighlight ]);

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
            textDocumentId: documentId,
            paragraphId: paragraph.id,
            start: indices.start,
            end: indices.end
        });
        
        if (!addResult.success)
            window.getSelection()?.removeAllRanges();

    }, [documentId, paragraph.id, addHighlight]);

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
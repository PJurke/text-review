'use client';

import React, { useMemo, useRef, useState } from "react";

import useAddHighlight from "@/services/add-highlight/client/use-add-highlight-hook";
import useRemoveHighlight from "@/services/remove-highlight/client/use-remove-highlight-hook";

import Paragraph from "@/types/Paragraph";
import { getSelectionIndices } from "../utils";
import Highlight from "@/types/Highlight";

interface Segment {
    text: string;
    highlightIds: string[]
}

interface ParagraphProps {
    documentId: string;
    paragraph: Paragraph;
    highlights: Highlight[];
}

export default function ParagraphComponent({ documentId, paragraph, highlights }: ParagraphProps) {

    // Reference to paragraph - used for correct mouse highlighting location
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;

    const { addHighlight, highlight, loading: addHighlightLoading, error: addHighlightError } = useAddHighlight();
    const { removeHighlight, loading: removeHighlightLoading, error: removeHighlightError } = useRemoveHighlight();

    // All existing highlights in the paragraph

    const paragraphHighlights = useMemo(() => {
        return highlights.filter(highlight => highlight.paragraphId === paragraph.id);
    }, [highlights, paragraph.id]);

    // Currently active highlight (ID = string)

    const [activeHighlight, setActiveHighlight] = useState<string>('');
    
    // Segmenting mechanism for working active highlighting
    const segments: Segment[] = useMemo(() => {
        
        // Start and end positions of all existing highlights + text boundaries (=segment positions)
        const boundaries = new Set<number>();

        paragraphHighlights.forEach(highlight => {
            boundaries.add(highlight.start);
            boundaries.add(highlight.end);
        });
        boundaries.add(0);
        boundaries.add(text.length);

        // Sorting segment positions ASC for algorithm
        const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
        const tempSegments: Segment[] = [];

        for (let i = 0; i < sortedBoundaries.length - 1; i++) {
            const segmentStart = sortedBoundaries[i];
            const segmentEnd = sortedBoundaries[i + 1];
            const segmentText = text.slice(segmentStart, segmentEnd);

            // Find all highlights that completely cover the current segment + store their highlight ids
            const coveringHighlights = paragraphHighlights
                .filter(highlight => highlight.start <= segmentStart && highlight.end >= segmentEnd)
                .map(highlight => highlight.id);

            tempSegments.push({
                text: segmentText,
                highlightIds: coveringHighlights
            });
        }

        return tempSegments;
    }, [text, paragraphHighlights]);

    const handleMouseEnter = (segment: Segment) => {
        // Set the first existing highlight ID as active when the segment is hovered
        if (segment.highlightIds.length > 0)
            setActiveHighlight(segment.highlightIds[0]);
    };

    const handleMouseLeave = () => {
        setActiveHighlight('');
    };

    const handleClick = (segment: Segment) => {
        if (segment.highlightIds.includes(activeHighlight) && activeHighlight)
            handleRemoveHighlight(activeHighlight);
    };

    const handleRemoveHighlight = async (highlightId: string) => {

        const removeResult = await removeHighlight({
            variables: {
                textDocumentId: documentId,
                highlightId: highlightId
            },
            optimisticResponse: {
                removeHighlight: {
                    success: true,
                    __typename: 'RemoveHighlightResponse'
                }
            }
        });

        if (!removeResult.errors)
            setActiveHighlight('');
        
    };

    const handleMouseUp = async () => {
        
        if (!paragraphRef.current)
            return;

        const indices = getSelectionIndices(paragraphRef);
        if (!indices || indices.start === indices.end)
            return;

        const addResult = await addHighlight({
            variables: {
                textDocumentId: documentId,
                paragraphId: paragraph.id,
                start: indices.start,
                end: indices.end
            },
            optimisticResponse: {
                addHighlight: {
                    id: 'temp-id', // Provisional Id for optimistic UI
                    paragraphId: paragraph.id,
                    start: indices.start,
                    end: indices.end,
                    __typename: 'Highlight',
                }
            }
        });
        
        if (!addResult.errors)
            window.getSelection()?.removeAllRanges();

    };

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
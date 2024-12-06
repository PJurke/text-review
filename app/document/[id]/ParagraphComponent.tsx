'use client'

import { v4 as uuidv4 } from 'uuid';
import { useStore } from "@/app/lib/store/AppStore";
import { Paragraph } from "@/app/lib/TextDocument";
import React, { useMemo, useRef, useState } from "react";
import { getSelectionIndices } from "./utils";

interface Segment {
    text: string;
    highlightIds: string[]
}

interface ParagraphProps {
    paragraph: Paragraph;
}

export default function ParagraphComponent({ paragraph }: ParagraphProps) {
    
    // Reference to paragraph - used for correct mouse highlighting location
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;

    const allHighlights = useStore(state => state.highlights);
    const addHighlight = useStore(state => state.addHighlight);
    const removeHighlight = useStore((state) => state.removeHighlight);

    // All existing highlights in the paragraph
    const highlights = useMemo(() => 
        allHighlights.filter(highlight => highlight.paragraphId === paragraph.id),
        [allHighlights, paragraph.id]
    );

    // Currently active highlight (ID = string)
    const [activeHighlight, setActiveHighlight] = useState<string>('');
    
    // Segmenting mechanism for working active highlighting
    const segments: Segment[] = useMemo(() => {
        
        // Start and end positions of all existing highlights + text boundaries (=segment positions)
        let boundaries = new Set<number>();

        highlights.forEach(highlight => {
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
            const coveringHighlights = highlights
                .filter(highlight => highlight.start <= segmentStart && highlight.end >= segmentEnd)
                .map(highlight => highlight.id);

            tempSegments.push({
                text: segmentText,
                highlightIds: coveringHighlights
            });
        }

        return tempSegments;
    }, [text, highlights]);

    const handleMouseEnter = (segment: Segment) => {
        if (segment.highlightIds.length > 0) {
            // Set the first existing highlight ID as active when the segment is hovered
            setActiveHighlight(segment.highlightIds[0]);
        }
    };

    const handleRemoveHighlight = (highlightId: string) => {
        removeHighlight(highlightId);
        setActiveHighlight('');
    };

    const handleMouseUp = () => {
        
        if (!paragraphRef.current)
            return

        const indices = getSelectionIndices(paragraphRef);
        if (!indices || indices.start === indices.end)
            return;

        addHighlight({
            id: uuidv4(),
            paragraphId: paragraph.id,
            start: indices.start,
            end: indices.end,
        });

        window.getSelection()?.removeAllRanges();

    };

    return (
        <p ref={paragraphRef} onMouseUp={handleMouseUp} className="leading-9 mt-8 text-lg">
            {segments.map((segment, index) => {

                if (segment.highlightIds.length === 0)
                    return <React.Fragment key={index}>{segment.text}</React.Fragment>;

                // Determine if the current segment is part of the active highlight
                const isActive = segment.highlightIds.includes(activeHighlight);

                return (
                    <mark
                        key={index}
                        className={`${isActive ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter(segment)}
                        onMouseLeave={() => setActiveHighlight('')}
                        onClick={() => {
                            if (isActive && activeHighlight)
                                handleRemoveHighlight(activeHighlight);
                        }}
                    >
                        {segment.text}
                    </mark>
                );
            })}
        </p>
    );
}
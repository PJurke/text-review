'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React from "react";
import HighlightedText from "./HighlightedText";

interface ParagraphProps {
    paragraph: Paragraph;
    highlights: Highlight[];
    onShowTooltip: (
        position: { top: number; left: number }, 
        selectedRange?: { start: number; end: number },
        existingHighlight?: Highlight | null
    ) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function ParagraphComponent({ 
    paragraph,
    highlights,
    onShowTooltip,
    containerRef
}: ParagraphProps) {
    
    const sortedHighlights = React.useMemo(() => {
        return [...highlights].sort((a, b) => {
            if (a.start.paragraphId !== b.start.paragraphId) {
                return a.start.paragraphId.localeCompare(b.start.paragraphId);
            }
            return a.start.offset - b.start.offset;
        })
    }, [highlights])

    return (
        <p>
            <HighlightedText 
                paragraph={paragraph} 
                highlights={sortedHighlights} 
                onShowTooltip={onShowTooltip}
                containerRef={containerRef}
            />
        </p>
    )
}
'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React from "react";
import HighlightedText from "./HighlightedText";

interface ParagraphProps {
    paragraph: Paragraph;
    highlights: Highlight[];
    onAddHighlight: (highlight: Highlight) => void;
    onRemoveHighlight: (highlight: Highlight) => void;
}

export default function ParagraphComponent({ paragraph, highlights, onAddHighlight, onRemoveHighlight }: ParagraphProps) {
    
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
                onAddHighlight={onAddHighlight}
                onRemoveHighlight={onRemoveHighlight}
            />
        </p>
    )
}
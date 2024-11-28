'use client'

import TextDocument from "@/app/lib/TextDocument";
import { Highlight } from "@/app/lib/TextDocument";
import React from "react";
import ParagraphComponent from "./ParagraphComponent";

interface TextDocumentProps {
    document: TextDocument;
}

export default function TextDocumentComponent({document}: TextDocumentProps) {
    
    const [highlights, setHighlights] = React.useState<Highlight[]>(document.highlights);

    const highlightsByParagraph = React.useMemo(() => {
        const map: Record<string, Highlight[]> = {};

        highlights.forEach((highlight) => {
            const startIndex = document.paragraphs.findIndex(p => p.id === highlight.start.paragraphId);
            const endIndex = document.paragraphs.findIndex(p => p.id === highlight.end.paragraphId);

            if (startIndex === -1 || endIndex === -1) return;

            for (let i = startIndex; i <= endIndex; i++) {
                const paragraphId = document.paragraphs[i].id;
                if (!map[paragraphId]) {
                    map[paragraphId] = [];
                }
                map[paragraphId].push(highlight);
            }
        })

        return map;

    }, [highlights, document.paragraphs]);
    
    const handleAddHighlight = (highlight: Highlight) => {
        // Prüfe auf Überlappungen vor dem Hinzufügen
        const overlappingHighlight = highlights.find(h => 
            h.start.paragraphId === highlight.start.paragraphId &&
            h.start.offset <= highlight.end.offset &&
            h.end.offset >= highlight.start.offset
        );

        if (!overlappingHighlight) {
            setHighlights(prev => [...prev, highlight]);
        }
    };

    const handleRemoveHighlight = (highlightToRemove: Highlight) => {
        setHighlights(prev => 
            prev.filter(highlight => highlight.id !== highlightToRemove.id)
        );
    };

    return (
        <div>
            <h1 className="text-3xl">{document.title}</h1>

            {document.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                    highlights={highlightsByParagraph[paragraph.id] || []}
                    onAddHighlight={handleAddHighlight}
                    onRemoveHighlight={handleRemoveHighlight}
                />
            ))}
        </div>
    )
}
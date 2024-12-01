'use client'

import TextDocument from "@/app/lib/TextDocument";
import { Highlight } from "@/app/lib/TextDocument";
import React, { useEffect } from "react";
import ParagraphComponent from "./ParagraphComponent";
import TextHighlightToggle from "./TextHighlightToggle";
import { useStore } from "./TextDocumentStore";

interface TextDocumentProps {
    document: TextDocument;
}

export default function TextDocumentComponent({document}: TextDocumentProps) {
    
    const highlights = useStore((state) => state.highlights);
    const addHighlight = useStore((state) => state.addHighlight);
    const removeHighlight = useStore((state) => state.removeHighlight);
    const setHighlights = useStore((state) => state.setHighlights);

    const tooltipState = useStore((state) => state.tooltipState);
    const showTooltip = useStore((state) => state.showTooltip);
    const hideTooltip = useStore((state) => state.hideTooltip);
    const setDocument = useStore((state) => state.setDocument);

    useEffect(() => {
        setDocument(document);
        setHighlights(document.highlights);
    }, [document, setDocument, setHighlights]);

    const documentRef = React.useRef<HTMLDivElement>(null);

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
            addHighlight(highlight)
            hideTooltip();
        }
    };

    const handleRemoveHighlight = (highlightToRemove: Highlight) => {
        removeHighlight(highlightToRemove.id)
        hideTooltip();
    };

    return (
        <div ref={documentRef}>
            <h1 className="text-3xl">{document.title}</h1>

            {document.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                    highlights={highlightsByParagraph[paragraph.id] || []}
                    onShowTooltip={(position, selectedRange, existingHighlight) => 
                        showTooltip({
                            position, 
                            paragraphId: paragraph.id, 
                            selectedRange, 
                            existingHighlight
                        })
                    }
                    containerRef={documentRef}
                />
            ))}

            {tooltipState.visible && (
                <div 
                    style={{
                        position: 'absolute',
                        left: `${tooltipState.position.left}px`,
                        top: `${tooltipState.position.top}px`,
                    }}
                    className="z-50"
                >
                    <TextHighlightToggle 
                        position={{
                            top: 0,
                            left: 0
                        }}
                        onHighlight={() => {
                            if (tooltipState.selectedRange) {
                                const paragraph = document.paragraphs.find(p => p.id === tooltipState.paragraphId);
                                if (paragraph && tooltipState.selectedRange) {
                                    
                                    const newHighlight: Highlight = {
                                        id: `h${Date.now()}`,
                                        start: { 
                                            paragraphId: paragraph.id, 
                                            offset: tooltipState.selectedRange.start 
                                        },
                                        end: { 
                                            paragraphId: paragraph.id, 
                                            offset: tooltipState.selectedRange.end 
                                        },

                                    };

                                    handleAddHighlight(newHighlight);
                                }
                            }
                        }}
                        onRemove={() => {
                            if (tooltipState.existingHighlight) {
                                handleRemoveHighlight(tooltipState.existingHighlight);
                            }
                        }}
                        hasExistingHighlight={!!tooltipState.existingHighlight}
                    />
                </div>
            )}

        </div>
    )
}
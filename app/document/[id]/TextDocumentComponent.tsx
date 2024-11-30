'use client'

import TextDocument from "@/app/lib/TextDocument";
import { Highlight } from "@/app/lib/TextDocument";
import React from "react";
import ParagraphComponent from "./ParagraphComponent";
import TextHighlightToggle from "./TextHighlightToggle";

interface TextDocumentProps {
    document: TextDocument;
}

export default function TextDocumentComponent({document}: TextDocumentProps) {
    
    const [highlights, setHighlights] = React.useState<Highlight[]>(document.highlights);

    const [tooltipState, setTooltipState] = React.useState<{
        visible: boolean;
        position: { top: number; left: number };
        selectedRange: { start: number; end: number } | null;
        paragraphId: string | null;
        existingHighlight: Highlight | null;
    }>({
        visible: false,
        position: { top: 0, left: 0 },
        selectedRange: null,
        paragraphId: null,
        existingHighlight: null
    });

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
    
    const showTooltip = (params: {
        position: { top: number; left: number };
        paragraphId: string;
        selectedRange?: { start: number; end: number };
        existingHighlight?: Highlight | null;
    }) => {
        setTooltipState({
            visible: true,
            position: params.position,
            paragraphId: params.paragraphId,
            selectedRange: params.selectedRange || null,
            existingHighlight: params.existingHighlight || null
        });
    };

    const hideTooltip = () => {
        setTooltipState(prev => ({
            ...prev,
            visible: false,
            selectedRange: null,
            existingHighlight: null
        }));
    };

    const handleAddHighlight = (highlight: Highlight) => {
        // Prüfe auf Überlappungen vor dem Hinzufügen
        const overlappingHighlight = highlights.find(h => 
            h.start.paragraphId === highlight.start.paragraphId &&
            h.start.offset <= highlight.end.offset &&
            h.end.offset >= highlight.start.offset
        );

        if (!overlappingHighlight) {
            setHighlights(prev => [...prev, highlight]);
            hideTooltip();
        }
    };

    const handleRemoveHighlight = (highlightToRemove: Highlight) => {
        setHighlights(prev => 
            prev.filter(highlight => highlight.id !== highlightToRemove.id)
        );
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
                    onAddHighlight={handleAddHighlight}
                    onRemoveHighlight={handleRemoveHighlight}
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
                                    const selectedText = paragraph.text.slice(
                                        tooltipState.selectedRange.start, 
                                        tooltipState.selectedRange.end
                                    );
                                    
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
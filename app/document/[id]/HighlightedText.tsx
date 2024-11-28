'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React, { useState, useRef, useEffect } from "react";
import Tooltip from "./Tooltip";

interface HighlightedTextProps {
    paragraph: Paragraph;
    highlights: Highlight[];
    onAddHighlight: (highlight: Highlight) => void;
    onRemoveHighlight: (highlight: Highlight) => void;
}

interface TextSegment {
    text: string;
    highlight: Highlight | null;
}

export default function HighlightedText({ paragraph, highlights, onAddHighlight, onRemoveHighlight}: HighlightedTextProps) {
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
    const [existingHighlight, setExistingHighlight] = useState<Highlight | null>(null);
    const paragraphRef = useRef<HTMLSpanElement>(null);

    const segments: TextSegment[] = [];
    const text = paragraph.text;
    const length = text.length;

    const highlightMap: (Highlight | null)[] = Array(length).fill(null);

    highlights.forEach(highlight => {
        let start = 0;
        let end = length;

        if (highlight.start.paragraphId === paragraph.id) {
            start = highlight.start.offset;
        }

        if (highlight.end.paragraphId === paragraph.id) {
            end = highlight.end.offset;
        }

        start = Math.max(0, Math.min(start, length));
        end = Math.max(start, Math.min(end, length));

        for (let i = start; i < end && i < length; i++) {
            if (!highlightMap[i]) {
                highlightMap[i] = highlight;
            }
        }
    });

    let currentHighlight = highlightMap[0];
    let currentText = '';

    for (let i = 0; i < length; i++) {
        if (highlightMap[i] !== currentHighlight) {
            if (currentText) {
                segments.push({
                    text: currentText,
                    highlight: currentHighlight,
                });
                currentText = '';
            }
            
            currentHighlight = highlightMap[i];
        }
        currentText += text[i];
    }

    if (currentText) {
        segments.push({
            text: currentText,
            highlight: currentHighlight,
        });
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0 && paragraphRef.current) {
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            if (startOffset === endOffset) {
                setTooltipPosition(null);
                return;
            }

            // Prüfe auf existierende Highlights im selektierten Bereich
            const selectedText = selection.toString();
            const overlappingHighlight = highlights.find(h => 
                h.start.paragraphId === paragraph.id && 
                text.slice(h.start.offset, h.end.offset) === selectedText
            );

            const selectionRect = range.getBoundingClientRect();
            const paragraphRect = paragraphRef.current.getBoundingClientRect();

            const tooltipPos = {
                left: selectionRect.left - paragraphRect.left + selectionRect.width / 2,
                top: selectionRect.top - paragraphRect.top - 40
            };

            setTooltipPosition(tooltipPos);
            setSelectedRange({ start: startOffset, end: endOffset });
            setExistingHighlight(overlappingHighlight || null);
        }
    };

    const handleHighlight = () => {
        if (selectedRange) {
            const selection = window.getSelection();
            if (selection) {
                const selectedText = selection.toString();
                
                const newHighlight: Highlight = {
                    id: `h${Date.now()}`,
                    start: { 
                        paragraphId: paragraph.id, 
                        offset: paragraph.text.indexOf(selectedText) 
                    },
                    end: { 
                        paragraphId: paragraph.id, 
                        offset: paragraph.text.indexOf(selectedText) + selectedText.length 
                    },
                };

                onAddHighlight(newHighlight);
                setTooltipPosition(null);
            }
        }
    };

    const handleRemoveHighlight = () => {
        if (existingHighlight) {
            onRemoveHighlight(existingHighlight);
            setTooltipPosition(null);
        }
    };

    return (
        <span 
            ref={paragraphRef}
            onMouseUp={handleMouseUp} 
            className="relative inline-block w-full"
        >
            {segments.map((segment, index) => {
                if (segment.highlight) {
                    return (
                        <mark key={index}>{segment.text}</mark>
                    )
                }
                return <span key={index}>{segment.text}</span>;
            })}
            
            {tooltipPosition && (
                <div 
                    style={{
                        position: 'absolute',
                        left: `${tooltipPosition.left}px`,
                        top: `${tooltipPosition.top}px`,
                    }}
                    className="z-50"
                >
                    <Tooltip 
                        position={{
                            top: 0,
                            left: 0
                        }}
                        onHighlight={handleHighlight}
                        onRemove={handleRemoveHighlight}
                        hasExistingHighlight={!!existingHighlight}
                    />
                </div>
            )}
        </span>
    )
}
'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React, { useState, useRef } from "react";

interface HighlightedTextProps {
    paragraph: Paragraph;
    highlights: Highlight[];
    onAddHighlight: (highlight: Highlight) => void;
    onRemoveHighlight: (highlight: Highlight) => void;
    onShowTooltip: (
        position: { top: number; left: number }, 
        selectedRange?: { start: number; end: number },
        existingHighlight?: Highlight | null
    ) => void;
}

interface TextSegment {
    text: string;
    highlight: Highlight | null;
}

export default function HighlightedText({ 
    paragraph, 
    highlights, 
    onAddHighlight, 
    onRemoveHighlight,
    onShowTooltip
}: HighlightedTextProps) {
    const paragraphRef = useRef<HTMLSpanElement>(null);

    const text = paragraph.text;
    const length = text.length;

    // Segmentierungslogik
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

    const segments: TextSegment[] = [];
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

            if (startOffset === endOffset) return;

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

            onShowTooltip(
                tooltipPos, 
                { start: startOffset, end: endOffset },
                overlappingHighlight || null
            );
        }
    };

    const handleMarkClick = (highlight: Highlight, event: React.MouseEvent) => {
        event.stopPropagation();
        
        const paragraphRect = paragraphRef.current?.getBoundingClientRect();
        
        if (paragraphRect) {
            const tooltipPos = {
                left: event.clientX - paragraphRect.left,
                top: event.clientY - paragraphRect.top - 40
            };

            onShowTooltip(
                tooltipPos, 
                undefined, 
                highlight
            );
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
                        <mark 
                            key={index} 
                            onClick={(e) => handleMarkClick(segment.highlight!, e)}
                            className="cursor-pointer bg-yellow-200 hover:bg-yellow-300 transition-colors"
                        >
                            {segment.text}
                        </mark>
                    )
                }
                return <span key={index}>{segment.text}</span>;
            })}
        </span>
    )
}
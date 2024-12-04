'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React, { useRef } from "react";

interface HighlightedTextProps {
    paragraph: Paragraph;
    sortedHighlights: Highlight[];
    /*onShowTooltip: (
        position: { top: number; left: number }, 
        selectedRange?: { start: number; end: number },
        existingHighlight?: Highlight | null
    ) => void;
    containerRef: React.RefObject<HTMLDivElement>;*/
}

interface TextSegment {
    text: string;
    highlight: Highlight | null;
}

export default function HighlightedText({ 
    paragraph,
    sortedHighlights
    //onShowTooltip,
    //containerRef
}: HighlightedTextProps) {

    const paragraphRef = useRef<HTMLSpanElement>(null);
    const text = paragraph.text
    const highlights = sortedHighlights
    const length = text.length;

    const elements = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
        const { start, end, id } = highlight;

        // Add text before the highlight
        if (lastIndex < start) {
            elements.push(<span key={`${id}-before`}>{text.slice(lastIndex, start)}</span>);
        }

        // Add the highlighted text
        elements.push(
            <mark key={`${id}-highlight`}>{text.slice(start, end)}</mark>
        );

        lastIndex = end;
    });

    // Add any remaining text after the last highlight
    if (lastIndex < text.length) {
        elements.push(<span key={`after-${paragraph.id}`}>{text.slice(lastIndex)}</span>);
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0 && paragraphRef.current /* && containerRef.current*/) {
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            if (startOffset === endOffset) return;

            console.log('handleMouseUp', startOffset, endOffset)

            const selectedText = selection.toString();
            /*const overlappingHighlight = highlights.find(h => 
                h.start.paragraphId === paragraph.id && 
                text.slice(h.start.offset, h.end.offset) === selectedText
            );*/

            /*const selectionRect = range.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const tooltipPos = {
                left: (selectionRect.left + (selectionRect.width * 0.5)),
                top: selectionRect.top - containerRect.top - 35,
            };*/

            /*onShowTooltip(
                tooltipPos, 
                { start: startOffset, end: endOffset },
                overlappingHighlight || null
            );*/
        }
    };

    /*const handleMarkClick = (highlight: Highlight, event: React.MouseEvent) => {
        event.stopPropagation();
        
        const paragraphRect = paragraphRef.current?.getBoundingClientRect();
        
        if (paragraphRect) {
            const tooltipPos = {
                left: paragraphRect.left,
                top: event.clientY - 60
            };

            onShowTooltip(
                tooltipPos, 
                undefined, 
                highlight
            );
        }
    };*/

    /*return (
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
                            //onClick={(e) => handleMarkClick(segment.highlight!, e)}
                            className="cursor-pointer bg-yellow-200 hover:bg-yellow-300 transition-colors"
                        >
                            {segment.text}
                        </mark>
                    )
                }
                return <span key={index}>{segment.text}</span>;
            })}
        </span>
    )*/
}
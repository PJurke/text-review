'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Segment {
    text: string;
    highlightIds: string[]
}

interface ParagraphProps {
    paragraph: Paragraph;
    /*onShowTooltip: (
        position: { top: number; left: number }, 
        selectedRange?: { start: number; end: number },
        existingHighlight?: Highlight | null
    ) => void;*/
}

export default function ParagraphComponent({ paragraph, /*onShowTooltip*/ }: ParagraphProps) {
    
    // Reference to paragraph - used for correct mouse highlighting location
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;

    // All existing highlights in the paragraph
    const [highlights, setHighlights] = useState<Highlight[]>(paragraph.highlights);

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
            const coveringHighlights= highlights
                .filter(highlight => highlight.start <= segmentStart && highlight.end >= segmentEnd)
                .map(highlight => highlight.id);

            tempSegments.push({
                text: segmentText,
                highlightIds: coveringHighlights
            });
        }

        return tempSegments;
    }, [text, highlights]);

    /*const getGlobalOffset = (node: Node, localOffset: number): number => {
        let offset = 0;
        const traverse = (currentNode: Node) => {
            if (currentNode === node) {
                // Wir haben den Start-/Endknoten erreicht
                offset += localOffset;
                return true; // Beende die Rekursion
            } else if (currentNode.nodeType === Node.TEXT_NODE) {
                // Textknoten: Länge zum Offset hinzufügen
                offset += currentNode.textContent?.length || 0;
            } else if (currentNode.childNodes) {
                for (let i = 0; i < currentNode.childNodes.length; i++) {
                    if (traverse(currentNode.childNodes[i])) {
                        return true;
                    }
                }
            }
            return false; // Knoten nicht gefunden
        };
        
        if (paragraphRef.current)
            traverse(paragraphRef.current);

        return offset;
    };*/

    /*const handleMouseUp = (event: React.MouseEvent) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startOffset = getGlobalOffset(range.startContainer, range.startOffset);
            const endOffset = getGlobalOffset(range.endContainer, range.endOffset);

            if (startOffset === endOffset) return;

            addHighlight({
                id: `h${Date.now()}`,
                start: startOffset,
                end: endOffset
            });
        }
    };

    const addHighlight = (highlight: Highlight) => {
        setHighlights([...highlights, highlight]);
    };*/

    const handleHighlightClick = (highlightId: string) => {
        setHighlights(oldHighlights =>
            oldHighlights.filter(highlight => highlight.id !== highlightId)
        );
    };

    const handleMouseEnter = (segment: Segment) => {
        if (segment.highlightIds.length > 0) {
            // Set the first existing highlight ID as active when the segment is hovered
            setActiveHighlight(segment.highlightIds[0]);
        }
    };

    /*const handleMarkMouseEnter = (highlightIds: string[]) => {
        setHoveredHighlightIds(prev => {
            const newSet = new Set(prev);
            highlightIds.forEach(id => newSet.add(id));
            return newSet;
        });
    };
    
    const handleMarkMouseLeave = (highlightIds: string[]) => {
        setHoveredHighlightIds(prev => {
            const newSet = new Set(prev);
            highlightIds.forEach(id => newSet.delete(id));
            return newSet;
        });
    };*/

    return (
        <p ref={paragraphRef} className="leading-9 mt-8 text-lg" /* onMouseUp={handleMouseUp}*/>
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
                    >
                        {segment.text}
                    </mark>
                );
            })}
        </p>
    );
}
'use client'

import { Paragraph, Highlight } from "@/app/lib/TextDocument";
import React, { useEffect, useRef, useState } from "react";

interface ParagraphProps {
    paragraph: Paragraph;
    /*onShowTooltip: (
        position: { top: number; left: number }, 
        selectedRange?: { start: number; end: number },
        existingHighlight?: Highlight | null
    ) => void;*/
}

export default function ParagraphComponent({ 
    paragraph,
    /*onShowTooltip*/
}: ParagraphProps) {
    
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;
    const [highlights, setHighlights] = useState<Highlight[]>(paragraph.highlights);
    const [hoveredHighlightIds, setHoveredHighlightIds] = useState<Set<string>>(new Set());

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    let positions = new Set<number>();
    highlights.forEach(highlight => {
        positions.add(highlight.start);
        positions.add(highlight.end);
    });
    positions.add(0);
    positions.add(text.length);
    let sortedPositions = Array.from(positions).sort((a, b) => a - b);
    
    let segments = [];
    for (let i = 0; i < sortedPositions.length - 1; i++) {
        const start = sortedPositions[i];
        const end = sortedPositions[i + 1];
        const segmentText = text.slice(start, end);

        // Bestimmen der aktiven Highlights für das Segment
        const activeHighlightIds = highlights
            .filter(highlight => highlight.start < end && highlight.end > start)
            .map(highlight => highlight.id);

        segments.push({
            text: segmentText,
            highlightIds: activeHighlightIds
        });
    }

    const renderSegments = segments.map((segment, index) => {
        const { text: segmentText, highlightIds } = segment;
    
        if (highlightIds.length > 0) {
            // Generieren der Klassen als String
            const classNames = highlightIds.map(id => `highlight-${id}`).join(' ');
    
            // Prüfen, ob eines der Highlight-IDs gehovt wird
            const isHovered = highlightIds.some(id => hoveredHighlightIds.has(id));
            const combinedClassNames = `${classNames} ${isHovered ? 'hovered' : ''}`;
    
            return (
                <mark
                    key={index}
                    className={combinedClassNames}
                    onMouseEnter={() => handleMarkMouseEnter(highlightIds)}
                    onMouseLeave={() => handleMarkMouseLeave(highlightIds)}
                    onClick={() => handleHighlightClick(highlightIds)}
                >
                    {segmentText}
                </mark>
            );
        } else {
            return <React.Fragment key={index}>{segmentText}</React.Fragment>;
        }
    });

    const getGlobalOffset = (node: Node, localOffset: number): number => {
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
    };

    const handleMouseUp = (event: React.MouseEvent) => {
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
    };

    const handleHighlightClick = (highlightIds: string[]) => {
        // Entfernen des ersten Highlights (oder passen Sie dies nach Bedarf an)
        const highlightIdToRemove = highlightIds[0];

        setHighlights(oldHighlights =>
            oldHighlights.filter(highlight => highlight.id !== highlightIdToRemove)
        );
    };

    const handleMarkMouseEnter = (highlightIds: string[]) => {
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
    };

    useEffect(() => {
        const styleElement = document.createElement('style');
        const uniqueHighlightIds = new Set(highlights.map(h => h.id));

        let styleContent = '';

        uniqueHighlightIds.forEach(id => {
            styleContent += `
                .highlight-${id} {
                    background-color: yellow;
                    transition: background-color 0.3s;
                }
                .highlight-${id}:hover,
                .highlight-${id}.hovered {
                    background-color: orange;
                    cursor: pointer;
                }
            `;
        });

        styleElement.textContent = styleContent;
        document.head.appendChild(styleElement);

        // Cleanup-Funktion, um das Style-Element zu entfernen, wenn die Komponente unmountet wird
        return () => {
            document.head.removeChild(styleElement);
        };
    }, [highlights]);

    return (
        <p ref={paragraphRef} onMouseUp={handleMouseUp}>
            {renderSegments}
        </p>
    );
}
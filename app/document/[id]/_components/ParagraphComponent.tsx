'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

// Hooks
import useAddHighlight from "@/services/add-highlight/client/use-add-highlight-hook";
import useRemoveHighlight from "@/services/remove-highlight/client/use-remove-highlight-hook";
import useErrorOverlay from "@/components/ErrorOverlay/useErrorOverlay";

// Types
import Paragraph from "@/types/Paragraph";
import Highlight from "@/types/Highlight";

// Utils
import { getSelectionIndices } from "../utils";
import segmentParagraph, { Segment } from "../_utils/segmentParagraph";

interface ParagraphProps {
    documentId: string;
    paragraph: Paragraph;
    highlights: Highlight[];
}

export default function ParagraphComponent({ documentId, paragraph, highlights }: ParagraphProps): JSX.Element {

    // Reference to paragraph - used for correct mouse highlighting location
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const text = paragraph.text;

    const { showErrorOverlay } = useErrorOverlay();
    const { addHighlight, error: addError } = useAddHighlight();
    const { removeHighlight, error: removeError } = useRemoveHighlight();

    useEffect(() => {
        if (addError) {
            switch (addError.message) {
                case 'Document not found':
                case 'Paragraph not found':
                case 'Invalid input':
                default: {
                    showErrorOverlay({
                        title: 'Error Saving Highlight',
                        message: 'An unknown server error occurred while saving the highlight.',
                        action: {
                            handler: () => window.location.reload(),
                            label: 'Please try reloading the page.'
                        }
                    });
                }
            }
        }
    }, [addError, showErrorOverlay]);

    useEffect(() => {
        if (removeError) {
            switch (removeError.message) {
                case 'Document not found':
                case 'Highlight not found':
                case 'Invalid input':
                default: {
                    showErrorOverlay({
                        title: 'Error Removing Highlight',
                        message: 'An unknown server error occurred while removing the highlight.',
                        action: {
                            handler: () => window.location.reload(),
                            label: 'Please try reloading the page.'
                        }
                    });
                }
            }
        }
    }, [removeError, showErrorOverlay])
    
    // All existing highlights in the paragraph

    const paragraphHighlights = useMemo(() => {
        return highlights.filter(highlight => highlight.paragraphId === paragraph.id);
    }, [highlights, paragraph.id]);

    // Currently active highlight (ID = string)

    const [activeHighlight, setActiveHighlight] = useState<string>('');
    
    // Segmenting mechanism for working active highlighting
    const segments: Segment[] = useMemo(() => {
        return segmentParagraph(text, paragraphHighlights);
    }, [text, paragraphHighlights]);

    const handleMouseEnter = (segment: Segment) => {
        // Set the first existing highlight ID as active when the segment is hovered
        if (segment.highlightIds.length > 0)
            setActiveHighlight(segment.highlightIds[0]);
    };

    const handleMouseLeave = () => {
        setActiveHighlight('');
    };

    const handleClick = (segment: Segment) => {
        if (segment.highlightIds.includes(activeHighlight) && activeHighlight)
            handleRemoveHighlight(activeHighlight);
    };

    const handleRemoveHighlight = async (highlightId: string) => {

        const removeResult = await removeHighlight({
            variables: {
                textDocumentId: documentId,
                highlightId: highlightId
            },
            optimisticResponse: {
                removeHighlight: {
                    success: true,
                    __typename: 'RemoveHighlightResponse'
                }
            }
        });

        if (!removeResult.errors)
            setActiveHighlight('');
        
    };

    const handleMouseUp = async () => {
        
        if (!paragraphRef.current)
            return;

        const indices = getSelectionIndices(paragraphRef);
        if (!indices || indices.start === indices.end)
            return;

        const addResult = await addHighlight({
            variables: {
                textDocumentId: documentId,
                paragraphId: paragraph.id,
                start: indices.start,
                end: indices.end
            },
            optimisticResponse: {
                addHighlight: {
                    id: 'temp-id', // Provisional Id for optimistic UI
                    paragraphId: paragraph.id,
                    start: indices.start,
                    end: indices.end,
                    __typename: 'Highlight',
                }
            }
        });
        
        if (!addResult.errors)
            window.getSelection()?.removeAllRanges();

    };

    return (

        <p ref={paragraphRef} onMouseUp={handleMouseUp} className="leading-9 mt-8 text-lg">
            {segments.map((segment, index) => {

                if (segment.highlightIds.length === 0)
                    return <React.Fragment key={index}>{segment.text}</React.Fragment>;

                // Determine if the current segment is part of the active highlight
                const isActive = segment.highlightIds.includes(activeHighlight);

                // Create a unique key for the `mark` element
                const markKey = `${index}-${segment.highlightIds.join('-')}`;

                return (
                    <mark
                        key={markKey}
                        className={`${isActive ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter(segment)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(segment)}
                    >
                        {segment.text}
                    </mark>
                );
            })}
        </p>

    );
}
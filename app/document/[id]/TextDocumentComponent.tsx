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

    /*const tooltipState = useStore((state) => state.tooltipState);
    const showTooltip = useStore((state) => state.showTooltip);
    const hideTooltip = useStore((state) => state.hideTooltip);*/

    const documentRef = React.useRef<HTMLDivElement>(null);

    /*const onHighlight = () => {

        if (tooltipState.selectedRange) {

            const paragraph = document.paragraphs.find(p => p.id === tooltipState.paragraphId);

            if (!paragraph || !tooltipState.selectedRange)
                return

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

            console.log(
                newHighlight
            )

            handleAddHighlight(newHighlight);
        }
    }*/

    /*const onRemove = () => {
        if (tooltipState.existingHighlight) {
            handleRemoveHighlight(tooltipState.existingHighlight);
        }
    }*/

    return (
        <div ref={documentRef}>
            <h1 className="text-3xl">{document.title}</h1>

            {document.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                    /*onShowTooltip={(position, selectedRange, existingHighlight) => showTooltip({
                        position,
                        paragraphId: paragraph.id,
                        selectedRange,
                        existingHighlight
                    })}
                    containerRef={documentRef}*/
                />
            ))}

        </div>
    )
}

/*
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
                        onHighlight={onHighlight}
                        onRemove={onRemove}
                        hasExistingHighlight={!!tooltipState.existingHighlight}
                    />
                </div>
            )}
*/
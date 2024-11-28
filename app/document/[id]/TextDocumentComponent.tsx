import TextDocument from "@/app/lib/TextDocument";
import { Highlight } from "@/app/lib/TextDocument";
import React from "react";
import ParagraphComponent from "./ParagraphComponent";

interface TextDocumentProps {
    document: TextDocument;
}

export default function TextDocumentComponent({document}: TextDocumentProps) {
    
    const highlightsByParagraph = React.useMemo(() => {
        const map: Record<string, Highlight[]> = {};

        document.highlights.forEach((highlight) => {
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

    }, [document.highlights, document.paragraphs]);
    
    return (
        <div>
            <h1 className="text-3xl">{document.title}</h1>

            {document.paragraphs.map(paragraph => (
                <ParagraphComponent key={paragraph.id} paragraph={paragraph} highlights={highlightsByParagraph[paragraph.id] || []} />
            ))}

        </div>
    )
}
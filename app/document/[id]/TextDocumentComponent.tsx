'use client'

import TextDocument from "@/app/lib/TextDocument";
import React, { useEffect } from "react";
import ParagraphComponent from "./ParagraphComponent";
import { useStore } from "@/app/lib/store/AppStore";

interface TextDocumentProps {
    document: TextDocument;
}

export default function TextDocumentComponent({document}: TextDocumentProps) {

    const documentRef = React.useRef<HTMLDivElement>(null);
    const setHighlights = useStore(state => state.setHighlights);

    useEffect(() => {
        setHighlights(document.highlights);
    }, [document.highlights, setHighlights]);

    return (
        <div ref={documentRef}>
            <h1 className="text-3xl">{document.title}</h1>

            {document.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                />
            ))}

        </div>
    )
}
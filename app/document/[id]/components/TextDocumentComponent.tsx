'use client'

import { TextDocumentSchema } from "@/types/TextDocument";
import React, { useEffect } from "react";
import ParagraphComponent from "./ParagraphComponent";
import { useStore } from "@/app/lib/store/AppStore";
import useTextDocument from "@/app/api/graphql/hooks/useTextDocument";
import { useParams } from "next/navigation";
import DocumentNotFoundMessage from "./DocumentNotFoundMessage";

export default function TextDocumentComponent() {

    const { id } = useParams<{id: string}>();
    TextDocumentSchema.shape.id.parse(id)

    const { textDocument, loading, error } = useTextDocument(id);
    const documentRef = React.useRef<HTMLDivElement>(null);
    const setHighlights = useStore(state => state.setHighlights);

    useEffect(() => {
        if (textDocument)
            setHighlights(textDocument.highlights);
    }, [textDocument?.highlights, setHighlights]);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!textDocument) return <DocumentNotFoundMessage />

    return (
        <div ref={documentRef}>
            <h1 className="text-3xl">{textDocument.title}</h1>

            {textDocument.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                />
            ))}

        </div>
    )
}
'use client';

import React from "react";
import { useParams } from "next/navigation";

import { TextDocumentSchema } from "@/types/TextDocument";
import useTextDocument from "@/services/get-document/client/use-text-document-hook";

import ParagraphComponent from "./ParagraphComponent";
import DocumentNotFoundMessage from "./DocumentNotFoundMessage";
import InvalidIdMessage from "./InvalidIdMessage";

export default function TextDocumentComponent() {

    // 1. Extract id and validate it

    const { id } = useParams<{id: string}>();
    const parseResult = TextDocumentSchema.shape.id.safeParse(id)

    if (parseResult.error)
        return <InvalidIdMessage />

    // 2. Use text document and add highlight hooks

    const { textDocument, loading, error } = useTextDocument(id);

    const documentRef = React.useRef<HTMLDivElement>(null);

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
                    documentId={id}
                />
            ))}

        </div>
    )
}
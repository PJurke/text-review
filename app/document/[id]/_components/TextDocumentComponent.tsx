'use client';

import { useParams } from "next/navigation";

import { TextDocumentSchema } from "@/types/TextDocument";
import useTextDocument from "@/services/get-document/client/use-text-document-hook";

import ParagraphComponent from "./ParagraphComponent";
import DocumentNotFoundMessage from "./DocumentNotFoundMessage";
import InvalidIdMessage from "./InvalidIdMessage";
import DocumentRetrievalErrorMessage from "./DocumentRetrievalErrorMessage";
import LoadingSkeleton from "./LoadingSkeleton";

export default function TextDocumentComponent(): JSX.Element {

    // 1. Extract id and validate it

    const { id } = useParams<{id: string}>();
    const parseResult = TextDocumentSchema.shape.id.safeParse(id);

    // 2. Use text document and add highlight hooks

    const { textDocument, loading, error } = useTextDocument(
        parseResult.success ? id : ''
    );

    if (parseResult.error) return <InvalidIdMessage />
    if (loading) return <LoadingSkeleton />
    if (error) return <DocumentRetrievalErrorMessage />
    if (!textDocument) return <DocumentNotFoundMessage />

    return (
        <div>

            <h1 className="text-3xl">{textDocument.title}</h1>

            {textDocument.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    paragraph={paragraph}
                    documentId={id}
                    highlights={textDocument.highlights}
                />
            ))}

        </div>
    );
}
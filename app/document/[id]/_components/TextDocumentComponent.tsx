'use client';

import { TextDocumentSchema } from "@/types/TextDocument";
import useTextDocument from "@/services/get-document/client/use-text-document-hook";

import ParagraphComponent from "./ParagraphComponent";
import DocumentNotFoundMessage from "./DocumentNotFoundMessage";
import InvalidIdMessage from "./InvalidIdMessage";
import DocumentRetrievalErrorMessage from "./DocumentRetrievalErrorMessage";
import LoadingSkeleton from "./LoadingSkeleton";

interface TextDocumentComponentProps {
    id: string;
}

export default function TextDocumentComponent({ id }: TextDocumentComponentProps): JSX.Element {

    // 1. Validate text document id

    const parseResult = TextDocumentSchema.shape.id.safeParse(id);

    // 2. Use text document and add highlight hooks

    const { textDocument, loading, error } = useTextDocument(
        parseResult.success ? id : ''
    );

    // 3. Check parameters

    if (parseResult.error) return <InvalidIdMessage />
    if (loading) return <LoadingSkeleton />
    if (error) return <DocumentRetrievalErrorMessage />
    if (!textDocument) return <DocumentNotFoundMessage />

    // 4. Render

    return (
        <div>

            <h1 className="text-3xl">{textDocument.title}</h1>
            <div className="text-neutral-500">by {textDocument.author}</div>

            {textDocument.paragraphs.map(paragraph => (
                <ParagraphComponent
                    key={paragraph.id}
                    documentId={id}
                    paragraph={paragraph}
                />
            ))}

        </div>
    );
}
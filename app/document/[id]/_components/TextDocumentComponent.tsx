import useTextDocument from "@/services/get-text-document/client/use-text-document-hook";
import { TextDocumentSchema } from "@/types/TextDocument";
import InvalidIdMessage from "./InvalidIdMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import TextDocumentRetrievalErrorMessage from "./TextDocumentRetrievalErrorMessage";
import TextDocumentNotFoundMessage from "./TextDocumentNotFoundMessage";
import ParagraphComponent from "./ParagraphComponent";

interface TextDocumentComponentProps {
    id: string;
}

export default function TextDocumentComponent({ id }: TextDocumentComponentProps): JSX.Element {

    // 1. Validate text analysis id
    
    const parseResult = TextDocumentSchema.shape.id.safeParse(id);

    // 2. Use text document

    const { textDocument, loading, error } = useTextDocument(
        parseResult.success ? id : ''
    );

    console.log(error);

    // 3. Check parameters
    
    if (parseResult.error) return <InvalidIdMessage />
    if (loading) return <LoadingSkeleton />
    if (error) return <TextDocumentRetrievalErrorMessage />
    if (!textDocument) return <TextDocumentNotFoundMessage />

    // 4. Render

    return (
        <div>
            <h1 className="text-3xl">{textDocument.title}</h1>
            <div className="text-neutral-500">by {textDocument.author}</div>

            { textDocument.paragraphs.map(paragraph =>
                <ParagraphComponent key={paragraph.id} text={paragraph.text} />
            )}
        </div>
    );

}
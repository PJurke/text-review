import TextDocument, { TextDocumentSchema } from '@/types/TextDocument';
import InvalidIdMessage from './_components/InvalidIdMessage';
import getTextDocument from '@/services/get-text-document/business-logic/get-text-document-logic';
import ParagraphComponent from './_components/ParagraphComponent';
import TextDocumentNotFoundMessage from './_components/TextDocumentNotFoundMessage';
import InternalErrorMessage from '@/components/errors/InternalErrorMessage';
import { TextDocumentNotFoundError } from '@/services/shared/errors/TextDocumentNotFoundError';

// Cache the specific page for 7 days
export const revalidate = 10080;

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {

    // 1. Extract id from url

    const { id } = await params;

    // 2. Validate text analysis id
        
    const parseResult = TextDocumentSchema.shape.id.safeParse(id);
    if (parseResult.error) return <InvalidIdMessage />

    // 3. Get text document from db
    
    let textDocument: TextDocument;
    
    try {
        textDocument = await getTextDocument(parseResult.data);
    } catch (error) {
        if (error instanceof TextDocumentNotFoundError) return <TextDocumentNotFoundMessage />;
        return <InternalErrorMessage />;
    }

    if (!textDocument) return <TextDocumentNotFoundMessage />

    // 4. Render paragraphs

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            {/*<CreateTextAnalysisButton id={id}/>*/}
            
            <h1 className="text-3xl">{textDocument.title}</h1>
            <div className="text-neutral-600">by {textDocument.author}</div>

            { textDocument.paragraphs.map(paragraph =>
                <ParagraphComponent key={paragraph.id} text={paragraph.text} />
            )}
        </section>
    );
}
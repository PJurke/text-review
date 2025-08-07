import logger from '@/lib/logger';

import InvalidIdMessage from '@/services/text-documents/ui/components/InvalidIdMessage';
import getTextDocument from '@/services/text-documents/get-text-document/get-text-document.service';
import ParagraphComponent from '@/services/text-documents/ui/components/ParagraphComponent';
import TextDocumentNotFoundMessage from '@/services/text-documents/ui/components/TextDocumentNotFoundMessage';
import { TextDocumentIdSchema } from '@/services/text-documents/text-document.model';

// Disable build time generation
export async function generateStaticParams() {
    return [];
}

// Cache this page forever
export const revalidate = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {

    
    // 1. Extract id from url
    
    const { id } = await params;
    logger.info(`Document Id Page: Page invoked`, { id });

    // 2. Validate text analysis id
        
    const parseResult = TextDocumentIdSchema.safeParse(id);
    if (parseResult.error) return <InvalidIdMessage />

    // 3. Get text document from db
    
    const textDocument = await getTextDocument(parseResult.data);

    if (!textDocument)
        return <TextDocumentNotFoundMessage />

    // 4. Render paragraphs

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto px-4 my-8 text-wrap transition-[max-width]">

            {/*<CreateTextAnalysisButton id={id}/>*/}
            
            { /* Be a little more generous (mb) in order to clarify the distinction between “metadata” (title, author) and the actual “content.” */  }
            <div className="mb-16">
                <h1 className="text-3xl">{textDocument.title}</h1>
                <div className="text-neutral-600">by {textDocument.author}</div>
            </div>

            { /* Slightly indent the first paragraph to create a visual anchor point */}
            <p className="leading-relaxed mt-8 text-lg font-medium">
                {textDocument.paragraphs[0].text}
            </p>

            {textDocument.paragraphs.slice(1).map(paragraph =>
                <ParagraphComponent key={paragraph.id} text={paragraph.text} />
            )}
        </section>
    );
}
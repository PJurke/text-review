import logger from '@/lib/logger';

import InvalidIdMessage from '@/services/text-documents/ui/components/InvalidIdMessage';
import getTextDocument from '@/services/text-documents/get-text-document/get-text-document.service';
import ParagraphComponent from '../../../services/text-documents/ui/components/ParagraphComponent';
import TextDocumentNotFoundMessage from '../../../services/text-documents/ui/components/TextDocumentNotFoundMessage';
import { TextDocumentSchema } from '@/services/text-documents/text-document.model';

// Enable on-demand caching (no build-time requests)
export async function generateStaticParams() {
    return [];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {

    
    // 1. Extract id from url
    
    const { id } = await params;
    logger.info(`Document Id Page: Page invoked`, { id });

    // 2. Validate text analysis id
        
    const parseResult = TextDocumentSchema.shape.id.safeParse(id);
    if (parseResult.error) return <InvalidIdMessage />

    // 3. Get text document from db
    
    const textDocument = await getTextDocument(parseResult.data);

    if (!textDocument)
        return <TextDocumentNotFoundMessage />

    // 4. Render paragraphs

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto px-4 my-8 text-wrap transition-[max-width]">
            {/*<CreateTextAnalysisButton id={id}/>*/}
            
            <h1 className="text-3xl">{textDocument.title}</h1>
            <div className="text-neutral-600">by {textDocument.author}</div>

            { textDocument.paragraphs.map(paragraph =>
                <ParagraphComponent key={paragraph.id} text={paragraph.text} />
            )}
        </section>
    );
}
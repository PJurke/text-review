import TextDocument, { Paragraph } from '@/app/lib/TextDocument';
import { getDocument } from '@/app/lib/data/document-dto';
import { ObjectId } from "mongodb";
import InvalidIdMessage from './InvalidIdMessage';
import DocumentNotFoundMessage from './DocumentNotFoundMessage';
import TextDocumentComponent from './TextDocumentComponent';

interface PageParams {
    id: string
}

interface PageProps {
    params: PageParams
}

// Revalidates the page every 60 seconds
export const revalidate = 60;

export default async function Page({ params }: PageProps) {
    
    const { id } = params;

    const text: TextDocument = {
        id: 'abc',
        title: 'This is a title',
        paragraphs: [
            { 
                "id": "p1", 
                "text": "Do a quick search. Im ersten Absatz wird das Thema vorgestellt und die grundlegenden Aspekte erläutert. Dies schafft eine solide Basis für das Verständnis der folgenden Inhalte.",
                highlights: [
                    { id: "h1", start: 0, end: 4 },
                    { id: "h2", start: 3, end: 10 },
                    { id: "h3", start: 5, end: 17 }
                ]
            },
            { 
                "id": "p2", 
                "text": "Der zweite Absatz vertieft das Thema durch detaillierte Informationen und relevante Beispiele. Dadurch wird das Verständnis weiter gefördert und die Thematik aus verschiedenen Perspektiven beleuchtet.",
                highlights: [
                    {
                        id: "h4",
                        start: 18,
                        end: 36,
                    }
                ]
            },
            { 
                "id": "p3", 
                "text": "Im dritten Absatz werden die wichtigsten Erkenntnisse zusammengefasst und abschließende Gedanken präsentiert. Dies rundet das Thema ab und bietet dem Leser eine klare Schlussfolgerung.",
                highlights: [
                    {
                        id: "h5",
                        start: 0,
                        end: 17,
                    }
                ]
            }
        ]
    }

    // If the id is not defined or invalid
    if (!id || !ObjectId.isValid(id)) {
        return <InvalidIdMessage />
    }

    const sanitizedId = new ObjectId(id);
    let doc: TextDocument | null

    try {
        //doc = await getDocument(sanitizedId);
        doc = text
    } catch (error) {
        // To do: Add proper error message
        console.error('app/document/[id]/page.tsx:', error);
        return;
    }

    // If there is no document with the given id
    if (!doc) {
        return <DocumentNotFoundMessage />
    }

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <TextDocumentComponent document={doc} />
        </section>
    );
}
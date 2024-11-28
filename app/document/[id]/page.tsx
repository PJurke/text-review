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
            { id: "p1", text: "Dies ist der erste Absatz." },
            { id: "p2", text: "Dies ist der zweite Absatz." },
            { id: "p3", text: "Dies ist der dritte Absatz." },
        ],
        highlights: [
            {
                id: "h1",
                start: { paragraphId: "p1", offset: 5 },
                end: { paragraphId: "p2", offset: 10 },
            },
            {
                id: "h2",
                start: { paragraphId: "p3", offset: 0 },
                end: { paragraphId: "p3", offset: 15 },
            },
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
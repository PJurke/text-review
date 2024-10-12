import TextDocument from '@/app/lib/TextDocument';
import { getDocument } from '@/app/lib/data/document-dto';
import { ObjectId } from "mongodb";
import TextViewer from './text-viewer';
import InvalidIdMessage from './InvalidIdMessage';
import DocumentNotFoundMessage from './DocumentNotFoundMessage';

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

    // If the id is not defined or invalid
    if (!id || !ObjectId.isValid(id)) {
        return <InvalidIdMessage />
    }

    const sanitizedId = new ObjectId(id);
    let doc: TextDocument | null

    try {
        doc = await getDocument(sanitizedId);
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
            <h1 className="text-3xl">{doc?.title}</h1>
            <TextViewer paragraphs={doc?.paragraphs} />
        </section>
    );
}
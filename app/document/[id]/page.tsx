import TextDocument from '@/app/lib/TextDocument';
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

export default async function Page(props: PageProps) {
    
    const { id } = await props.params;

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
    if (!doc)
        return <DocumentNotFoundMessage />

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <TextDocumentComponent document={doc} />
        </section>
    );
}
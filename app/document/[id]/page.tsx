import TextDocument from '@/types/TextDocument';
import getDocument from '@/services/get-document';
import { ObjectId } from "mongodb";
import InvalidIdMessage from './components/InvalidIdMessage';
import DocumentNotFoundMessage from './components/DocumentNotFoundMessage';
import TextDocumentComponent from './components/TextDocumentComponent';

interface PageParams {
    id: string
}

interface PageProps {
    params: Promise<PageParams>
}

// Revalidates the page every 60 seconds
export const revalidate = 60;

export default async function Page({ params }: PageProps) {
    
    const { id } = await params;

    // If the id is not defined or invalid
    if (!id || !ObjectId.isValid(id)) {
        return <InvalidIdMessage />
    }

    let doc: TextDocument | null

    try {
        doc = await getDocument(id);
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
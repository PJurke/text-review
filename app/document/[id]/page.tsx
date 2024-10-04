import Document from '../../lib/Document';
import { getDocument } from "../../lib/data/document-dto";
import { ObjectId } from "mongodb";

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

    // If the id is not defined or not valid, then return NoDocumentFound
    if (!id || !ObjectId.isValid(id)) {
        // To do: Good user message
        return 'ID is invalid'
    }

    const sanitizedId = new ObjectId(id);

    const doc: Document | null = await getDocument(sanitizedId);

    if (!doc) {
        // To do: Good user message
        return 'No document found'
    }

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">{doc?.title}</h1>
            <div className="font-normal leading-relaxed md:leading-9 mt-6 md:text-xl">
                {doc.text2.map((paragraph, index) => (
                    // To do: Don't use index as key
                    <p className="mt-10" key={index}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
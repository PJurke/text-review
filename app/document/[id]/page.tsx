import { PageProps } from "@/.next/types/app/page";
import { getDocument } from "../../lib/data/document-dto";
import { ObjectId } from "mongodb";

export default async function Page(props: PageProps) {

    // Get timeline id from url
    const { id } = props.params;

    // If the id is not defined or not valid, then return NoDocumentFound
    if (!id || !ObjectId.isValid(id)) {
        return 'No document found!';
    }

    const doc = await getDocument(new ObjectId(props.params.id as string));

    // Check if doc is null

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">{doc?.title}</h1>
            <p className="leading-relaxed mt-6 text-lg">
                {doc?.text}
            </p>
        </section>
    );
}
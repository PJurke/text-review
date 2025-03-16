import { Metadata } from "next";
import listTextDocuments from "@/services/list-text-documents/business-logic/list-text-documents-logic";
import TextDocumentItem from "./_components/TextDocumentItem";

export const metadata: Metadata = {
    title: 'Text Review | List of Documents'
};

export default async function Page(): Promise<JSX.Element> {

    // 1. Get the text documents directly from the database

    const textDocumentSummaries = await listTextDocuments()

    // 2. Render

    return (
        <section className="md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            
            <h1 className="text-3xl">List of Documents</h1>

            <ul className="mt-6">
                { textDocumentSummaries.map(summary => 
                    <li key={summary.id}>
                        <TextDocumentItem title={summary.title} id={summary.id} author={summary.author} />
                    </li>
                )}
            </ul>

        </section>
    );
}
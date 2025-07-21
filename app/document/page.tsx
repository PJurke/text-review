import { Metadata } from "next";

import Show from "@/components/Show";

import listTextDocuments from "@/services/text-documents/list-text-documents/list-text-documents.service";
import TextDocumentItem from "@/services/text-documents/ui/components/TextDocumentItem";
import NoDocumentsFoundMessage from "@/services/text-documents/ui/components/NoDocumentsFoundMessage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'List of Documents'
};

export default async function Page(): Promise<JSX.Element> {

    // 1. Get the text documents directly from the database

    const textDocumentSummaries = await listTextDocuments()

    // 2. Render

    return (
        <section className="md:max-w-[75ch] mx-auto px-4 my-8 text-wrap transition-[max-width]">
            
            <h1 className="mb-8 text-3xl">List of Documents</h1>

            <Show when={textDocumentSummaries.length > 0}>
                <ul className="space-y-2">
                    { textDocumentSummaries.map(summary => 
                        <li key={summary.id}>
                            <TextDocumentItem title={summary.title} id={summary.id} author={summary.author} />
                        </li>
                    )}
                </ul>
            </Show>

            <Show when={textDocumentSummaries.length === 0}>
                <NoDocumentsFoundMessage />
            </Show>

        </section>
    );
}
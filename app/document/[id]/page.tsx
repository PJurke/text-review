'use client';

import { useParams } from 'next/navigation';
import TextDocumentComponent from './_components/TextDocumentComponent';

export default function Page(): JSX.Element {

    // 1. Extract id from url
    
    const { id } = useParams<{ id: string }>();

    // 2. Render TextDocument component

    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <TextDocumentComponent id={id} />
        </section>
    );
}
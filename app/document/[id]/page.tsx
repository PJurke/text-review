'use client';

import { useParams } from 'next/navigation';

import Show from '@/components/Show';
import TextDocumentComponent from './_components/TextDocumentComponent';
import useErrorOverlay from '@/components/ErrorOverlay/useErrorOverlay';
import { ErrorOverlayContainer }  from '@/components/ErrorOverlay/ErrorOverlayContainer';

export default function Page(): JSX.Element {

    // 1. Use error overlay hook

    const { isErrorOverlayVisible: errorOverlayVisible } = useErrorOverlay();

    // 2. Extract id from url
    
    const { id } = useParams<{ id: string }>();

    // 3. Render TextDocument and Error Overlay components

    return (
        <>
            <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
                <TextDocumentComponent id={id} />
            </section>

            <Show when={errorOverlayVisible}>
                <ErrorOverlayContainer />
            </Show>
        </>
    );
}
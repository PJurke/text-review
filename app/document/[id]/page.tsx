'use client';

import Show from '@/components/Show';
import TextDocumentComponent from './_components/TextDocumentComponent';
import useErrorOverlay from '@/components/ErrorOverlay/useErrorOverlay';
import { ErrorOverlayContainer }  from '@/components/ErrorOverlay/ErrorOverlayContainer';

export default function Page(): JSX.Element {

    const { isErrorOverlayVisible: errorOverlayVisible } = useErrorOverlay();

    return (
        <>
            <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
                <TextDocumentComponent />
            </section>

            <Show when={errorOverlayVisible}>
                <ErrorOverlayContainer />
            </Show>
        </>
    );
}
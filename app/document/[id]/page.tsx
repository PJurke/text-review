import TextDocumentComponent from './components/TextDocumentComponent';

export default function Page(): JSX.Element {
    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <TextDocumentComponent />
        </section>
    );
}
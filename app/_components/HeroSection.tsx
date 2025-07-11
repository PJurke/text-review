export default function HeroSection(): JSX.Element {
    return (
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="font-light mb-2 text-5xl">Text Review</h1>
            <p className="leading-relaxed text-gray-500 text-xl">
                Language shapes our interactions.<br />
                Texts carry meaning.
            </p>
        </section>
    );
}
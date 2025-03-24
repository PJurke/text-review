import LoadingSkeleton from "./_components/LoadingSkeleton";

export default function Loading(): JSX.Element {
    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <LoadingSkeleton />
        </section>
    );
}
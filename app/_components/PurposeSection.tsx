import Link from "next/link";

export default function PurposeSection(): JSX.Element {
    return (
        <section className="bg-gray-50 flex flex-col items-center justify-center px-4 py-16 text-gray-800">
            <p className="leading-relaxed md:max-w-[75ch] mb-2 text-center text-lg">
                I give you direct access to important information from all over the world - in your language.
                Analyze complex texts in a focused way and at your own pace.
                Gain clarity and form an opinion that is truly your own.
            </p>
            <Link className="text-gray-500 underline hover:text-gray-800" href="/why">Read more about the why</Link>
        </section>
    );
}
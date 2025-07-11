import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Why'
};

export default function WhyPage(): JSX.Element {
    return (
        <section className="max-w-[50ch] md:max-w-[75ch] mx-auto px-4 my-8 text-wrap transition-[max-width]">
            <h1 className="text-3xl mb-8">Why</h1>

            <h2 className="text-xl mb-2">My Mission</h2>

            <p className="leading-relaxed mb-8 text-lg">
                I believe that everyone should have direct access to important information
                and the opportunity to understand it in depth - regardless of language barriers.
            </p>

            <h2 className="text-xl mb-2">My Approach</h2>

            <p className="leading-relaxed mb-8 text-lg">
                That&apos;s why I centralize texts from various official sources in one place for you,
                have them automatically translated into your language and provide you with
                intuitive tools with which you can access the content in a focused and individual way.
            </p>

            <h2 className="text-xl mb-2">My Goal</h2>

            <p className="leading-relaxed mb-8 text-lg">
                With my application, I would like to enable you to gain clarity about a variety of texts,
                to analyze them with focus and in peace, and thus to form your own well-founded opinion.
                This is my contribution to a global and networked knowledge society.
            </p>
        </section>
    );
}